import os
import shutil
import re
import json

def get_lesson_info(root):
    """Read lesson.json and extract title, position, and published information."""
    lesson_json_path = os.path.join(root, "lesson.json")
    if not os.path.exists(lesson_json_path):
        return None, None, None
    
    with open(lesson_json_path, 'r', encoding='utf-8') as f:
        lesson_data = json.load(f)
    
    # Get position from directory name
    dir_name = os.path.basename(root)
    position_match = re.search(r'LSN_(\d+)_', dir_name)
    position = int(position_match.group(1)) if position_match else None
    
    # Get title from lesson.json - check both ENU and ANY keys
    title = lesson_data.get('ENU', {}).get('title') or lesson_data.get('ANY', {}).get('title', '')
    
    # Get published status
    published = lesson_data.get('published', True)  # Default to True if not specified
    
    return position, title, published

def load_url_rewrites(source_root):
    """Load URL rewriting rules from url_rewriting.json"""
    rewrite_path = os.path.join(source_root, "url_rewriting.json")
    print(f"\n📖 Loading URL rewrites from: {rewrite_path}")
    
    if not os.path.exists(rewrite_path):
        print("⚠️ No url_rewriting.json found")
        return []
    
    with open(rewrite_path, 'r', encoding='utf-8') as f:
        rewrites = json.load(f)
        print(f"✅ Loaded {len(rewrites)} URL rewrites")
        print("\nFirst few rewrites:")
        for i, rule in enumerate(rewrites[:3]):
            print(f"  {i+1}. {rule['sourceUrl']} -> {rule['destinationUrl']}")
    
    return rewrites

def reorganize_files(source_root, target_root):
    """Reorganizes files from the source directory to the target directory, preserving CTG hierarchy without prefixes."""
    
    if not os.path.exists(source_root):
        print(f"❌ Error: Source directory '{source_root}' does not exist.")
        return
    
    # Load URL rewriting rules
    url_rewrites = load_url_rewrites(source_root)
    
    os.makedirs(target_root, exist_ok=True)
    
    # Define directories to skip
    skip_directories = {'CTG_99_tests', 'CTG_01_pages', 'CTG_100_legacy'}
    
    json_mappings = {"category.json": "_category_.json"}
    
    # Update image extensions to include SVG
    image_extensions = {".png", ".jpg", ".jpeg", ".gif", ".svg"}
    
    # Recursively process files
    for root, dirs, files in os.walk(source_root, topdown=True):
        # Skip specified directories
        current_dir = os.path.basename(root)
        if current_dir in skip_directories:
            dirs.clear()  # This prevents os.walk from recursing into subdirectories
            continue
        
        relative_path = os.path.relpath(root, source_root)
        path_parts = relative_path.split(os.sep)
        
        # Determine the closest CTG parent in the hierarchy
        ctg_path = []
        for part in path_parts:
            if part.startswith("CTG_"):
                # Special case for CTG_50_docs
                if part.startswith("CTG_50_docs"):
                    ctg_path.append("documentation")
                else:
                    # Use regex to remove CTG_X_ or CTG_XX_ prefix
                    clean_name = re.sub(r'^CTG_\d+_', '', part)
                    ctg_path.append(clean_name)
        
        if ctg_path:
            target_dir = os.path.join(target_root, *ctg_path)
        else:
            target_dir = target_root  # Fallback (shouldn't happen in practice)
        
        os.makedirs(target_dir, exist_ok=True)

        # Get lesson information if available
        position, title, published = get_lesson_info(root)

        for file in files:
            # Skip _FRA.md files
            if file.endswith("_FRA.md"):
                continue
                
            src_path = os.path.join(root, file)
            _, ext = os.path.splitext(file)
            
            if file in json_mappings:
                transform_category_json(root, os.path.join(target_dir, json_mappings[file]))
                continue
            
            if file == "lesson.json":
                continue
            
            if ext.lower() in image_extensions:
                # Sanitize the filename before copying
                sanitized_filename = sanitize_filename(file)
                # Get the lesson name from the current directory
                lesson_name = re.sub(r"LSN_\d+_", "", os.path.basename(root))
                # Create img directory at the same level as the lesson file
                img_target_dir = os.path.join(target_dir, "img", lesson_name)
                os.makedirs(img_target_dir, exist_ok=True)
                shutil.copy2(src_path, os.path.join(img_target_dir, sanitized_filename))
            elif ext == ".md":
                # Remove both LSN_XX_ prefix and _ENU suffix
                lesson_name = re.sub(r"LSN_\d+_", "", os.path.splitext(file)[0])
                lesson_name = re.sub(r"_ENU$", "", lesson_name)
                dest_md = os.path.join(target_dir, f"{lesson_name}.md")
                update_md_image_references(src_path, dest_md, lesson_name, position, title, published, url_rewrites)
            else:
                continue  # Ignore other file types
    
    print(f"✅ Transformation complete!\n📂 Source: {source_root}\n📂 Target: {target_root}\n🖼️ Images updated in Markdown files.")

def transform_category_json(root, target_path):
    """Transforms category.json using folder name for label and position."""
    folder_name = os.path.basename(root)
    match = re.match(r'CTG_(\d+)_', folder_name)
    
    if not match:
        print(f"⚠️ Skipping category.json for folder '{folder_name}' (unexpected format)")
        return
        
    position = int(match.group(1))
    
    # Read the original category.json
    source_json_path = os.path.join(root, "category.json")
    if not os.path.exists(source_json_path):
        print(f"⚠️ category.json not found in '{root}'")
        return
        
    with open(source_json_path, 'r', encoding='utf-8') as f:
        source_data = json.load(f)
    
    # Get title from ENU or ANY key
    title = source_data.get('ENU', {}).get('title') or source_data.get('ANY', {}).get('title', '')
    
    category_data = {
        "label": title,
        "position": position,
        "link": {
            "type": "generated-index"
        }
    }
    
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    with open(target_path, "w", encoding="utf-8") as f:
        json.dump(category_data, f, ensure_ascii=False, indent=2)
    print(f"📄 Transformed category.json: {target_path}")

def sanitize_filename(filename):
    """Sanitize filename to remove problematic characters."""
    # Remove non-ASCII characters and replace spaces with underscores
    sanitized = re.sub(r'[^\x00-\x7F]+', '', filename)
    sanitized = re.sub(r'\s+', '_', sanitized)
    # Remove any other problematic characters
    sanitized = re.sub(r'[^a-zA-Z0-9._-]', '', sanitized)
    return sanitized

def update_md_image_references(src_md, dest_md, lesson_name, position=None, title=None, published=None, url_rewrites=None):
    """Replaces <img> tags with Markdown image syntax in .md files and adds YAML header."""
    with open(src_md, "r", encoding="utf-8") as f:
        content = f.read()
    
    print(f"\n🔍 Processing file: {src_md}")
    
    # Handle all /lesson/ links with different transformations
    # Modified pattern to ensure we catch the entire link
    link_pattern = r'\[([^\]]+)\]\(/lesson/([^\)]+)\)'
    
    def replace_link(match):
        link_text = match.group(1)
        link_path = match.group(2).strip()  # Add strip() to remove any whitespace
        original_url = f'/lesson/{link_path}'
        
        print(f"\n  Found link: [{link_text}]({original_url})")
        
        # First check for URL rewrites
        if url_rewrites:
            for rule in url_rewrites:
                if rule['sourceUrl'].rstrip('/') == original_url.rstrip('/'):
                    print(f"  ✅ Rewrite match: {rule['destinationUrl']}")
                    return f'[{link_text}]({rule["destinationUrl"]})'
        
        # No rewrite found, apply standard transformations
        if link_path.startswith('tutorial/'):
            new_url = f'/docs/{link_path}'
        elif link_path.startswith('platform/'):
            new_url = f'/docs/{link_path}'
        elif link_path.startswith('docs/'):
            # Remove 'docs/' prefix and add to documentation section
            new_url = f'/docs/documentation/{link_path[5:]}'
        elif link_path.startswith('documentation/'):
            # Already has documentation prefix
            new_url = f'/docs/{link_path}'
        else:
            # Default case: add to documentation section
            new_url = f'/docs/documentation/{link_path}'
        
        print(f"  ✅ Input: {original_url}")
        print(f"  ✅ Output: {new_url}")
        return f'[{link_text}]({new_url})'
    
    # Apply the link transformations with debugging
    print("\nProcessing links...")
    updated_content = content
    for match in re.finditer(link_pattern, content):
        original = match.group(0)
        replacement = replace_link(match)
        print(f"\nReplacing: {original}")
        print(f"With: {replacement}")
        updated_content = updated_content.replace(original, replacement)

    # Create YAML header if we have position, title, or published status
    yaml_header = ""
    if position is not None or title is not None or (published is not None and not published):
        yaml_header = "---\n"
        if not published:
            yaml_header += "sidebar_class_name: hidden\n"
        if position is not None:
            yaml_header += f"sidebar_position: {position}\n"
        if title:
            yaml_header += f"title: {title}\n"
        yaml_header += "---\n\n"
    
    # Replace success div blocks with tip blocks
    success_pattern = r'<div class="success">\s*(.*?)\s*</div>'
    def success_replacement(match):
        content = match.group(1).strip()
        return f":::tip[Success]\n  {content}\n:::"
    updated_content = re.sub(success_pattern, success_replacement, updated_content, flags=re.DOTALL)
    
    # Replace image references for <img> tags, but skip https links
    img_pattern = r'<img\s+src=["\']([^"\']+)["\'].*?>'
    def img_replacement(match):
        src = match.group(1)
        if src.startswith('http'):
            return f'![]({src})'
        return f"![](img/{lesson_name}/{sanitize_filename(os.path.basename(src))})"
    updated_content = re.sub(img_pattern, img_replacement, updated_content)
    
    # Update markdown-style image references, but skip https links
    def md_img_replacement(match):
        alt_text = match.group(1)
        img_path = match.group(0).split('(')[1][:-1]
        if img_path.startswith('http'):
            return f'![{alt_text}]({img_path})'
        return f"![{alt_text}](img/{lesson_name}/{sanitize_filename(os.path.basename(img_path))})"
    
    updated_content = re.sub(r'!\[(.*?)\]\((?!/img/)[^)]+\)', md_img_replacement, updated_content)
    
    # Add YAML header if it exists
    if yaml_header:
        updated_content = yaml_header + updated_content
    
    os.makedirs(os.path.dirname(dest_md), exist_ok=True)
    with open(dest_md, "w", encoding="utf-8") as f:
        f.write(updated_content)
    print(f"📝 Updated: {dest_md}")

if __name__ == "__main__":
    source = "/Users/alistairwheeler/Documents/Projets/docs/content"
    target = "/Users/alistairwheeler/simplicite-documentation/docs"
    reorganize_files(source, target)

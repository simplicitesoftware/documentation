import os
import shutil
import re
import json

def get_lesson_info(root):
    """Read lesson.json and extract title and position information."""
    lesson_json_path = os.path.join(root, "lesson.json")
    if not os.path.exists(lesson_json_path):
        return None, None
    
    with open(lesson_json_path, 'r', encoding='utf-8') as f:
        lesson_data = json.load(f)
    
    # Get position from directory name
    dir_name = os.path.basename(root)
    position_match = re.search(r'LSN_(\d+)_', dir_name)
    position = int(position_match.group(1)) if position_match else None
    
    # Get title from lesson.json - check both ENU and ANY keys
    title = lesson_data.get('ENU', {}).get('title') or lesson_data.get('ANY', {}).get('title', '')
    
    return position, title

def reorganize_files(source_root, target_root):
    """Reorganizes files from the source directory to the target directory, preserving CTG hierarchy without prefixes."""
    
    if not os.path.exists(source_root):
        print(f"❌ Error: Source directory '{source_root}' does not exist.")
        return
    
    os.makedirs(target_root, exist_ok=True)
    
    json_mappings = {"category.json": "_category_.json"}
    
    # Update image extensions to include SVG
    image_extensions = {".png", ".jpg", ".jpeg", ".gif", ".svg"}
    
    # Recursively process files
    for root, dirs, files in os.walk(source_root, topdown=True):
        relative_path = os.path.relpath(root, source_root)
        path_parts = relative_path.split(os.sep)
        
        # Determine the closest CTG parent in the hierarchy
        ctg_path = []
        for part in path_parts:
            if part.startswith("CTG_"):
                ctg_path.append(part[7:])  # Remove "CTG_XX_" prefix
        
        if ctg_path:
            target_dir = os.path.join(target_root, *ctg_path)
        else:
            target_dir = target_root  # Fallback (shouldn't happen in practice)
        
        os.makedirs(target_dir, exist_ok=True)

        # Get lesson information if available
        position, title = get_lesson_info(root)

        for file in files:
            src_path = os.path.join(root, file)
            _, ext = os.path.splitext(file)
            
            if file in json_mappings:
                transform_category_json(root, os.path.join(target_dir, json_mappings[file]))
                continue  # Skip further processing for category.json
            
            if file == "lesson.json":
                continue  # Skip lesson.json files
            
            if ext.lower() in image_extensions:
                # Get the lesson name from the current directory
                lesson_name = re.sub(r"LSN_\d+_", "", os.path.basename(root))
                # Create img directory at the same level as the lesson file
                img_target_dir = os.path.join(target_dir, "img", lesson_name)
                os.makedirs(img_target_dir, exist_ok=True)
                shutil.copy2(src_path, os.path.join(img_target_dir, file))
            elif ext == ".md":
                lesson_name = re.sub(r"LSN_\d+_", "", os.path.splitext(file)[0])
                dest_md = os.path.join(target_dir, f"{lesson_name}.md")
                update_md_image_references(src_path, dest_md, lesson_name, position, title)
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
        "position": position
    }
    
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    with open(target_path, "w", encoding="utf-8") as f:
        json.dump(category_data, f, ensure_ascii=False, indent=4)
    print(f"📄 Transformed category.json: {target_path}")

def update_md_image_references(src_md, dest_md, lesson_name, position=None, title=None):
    """Replaces <img> tags with Markdown image syntax in .md files and adds YAML header."""
    with open(src_md, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Create YAML header if we have position or title
    yaml_header = ""
    if position is not None or title is not None:
        yaml_header = "---\n"
        if position is not None:
            yaml_header += f"sidebar_position: {position}\n"
        if title:
            yaml_header += f"title: {title}\n"
        yaml_header += "---\n\n"
    
    # Replace image references
    img_pattern = r'<img\s+src=["\']([^"\']+)["\'].*?>'
    # Use /img/lesson_name/filename format
    updated_content = re.sub(img_pattern, lambda m: f"![](img/{lesson_name}/{os.path.basename(m.group(1))})", content)
    # Also update existing markdown-style image references that don't already have the correct path
    updated_content = re.sub(r'!\[\]\((?!/img/)[^)]+\)', 
                           lambda m: f"![](img/{lesson_name}/{os.path.basename(m.group(0).split('(')[1][:-1])})", 
                           updated_content)
    
    # Add YAML header if it exists
    if yaml_header:
        updated_content = yaml_header + updated_content
    
    os.makedirs(os.path.dirname(dest_md), exist_ok=True)
    with open(dest_md, "w", encoding="utf-8") as f:
        f.write(updated_content)
    print(f"📝 Updated: {dest_md}")

if __name__ == "__main__":
    source = input("Enter the full path of the source directory: ").strip()
    target = input("Enter the full path of the target directory: ").strip()
    reorganize_files(source, target)

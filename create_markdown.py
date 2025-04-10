from datetime import datetime
import sys
import json

def create_block_component(version):
    version_number = version[0]
    version_data = version[1]
    
    # Format the props for the PlatformBlock component
    code = f'<div class="ghost-md-anchor" id="{get_anchor(version_number)}">\n## {prettier_anchor(version)}\n</div>\n'
    
    code += f'<PlatformBlock\n'
    code += f'  version="{version_number}"\n'
    code += f'  maintenance="{version_data["maintenance"]}"\n'
    code += f'  releaseVersion="{version_data["version"]}"\n'
    code += f'  releaseDate="{prettier_date(version_data["date"])}"\n'
    
    # Handle doc resources
    if 'doc' in version_data['resources']:
        code += '  docResources={[\n'
        for doc_name, doc_url in version_data['resources']['doc'].items():
            code += f'    {{ name: "{doc_name}", url: "{doc_url}" }},\n'
        code += '  ]}\n'
    else:
        code += '  docResources={[]}\n'
    
    # Handle maven resources
    if 'maven' in version_data['resources']:
        code += '  mavenResources={[\n'
        for maven_name, maven_url in version_data['resources']['maven'].items():
            code += f'    {{ name: "{maven_name}", url: "{maven_url}" }},\n'
        code += '  ]}\n'
    else:
        code += '  mavenResources={[]}\n'
    
    # Add docker info if needed
    if 'docker' in version_data['resources']:
        dck_info = version_data['resources']['docker']['info']
        dck = dck_info.split("/")[-1]
        dck_light = dck + "-light"
        tags = [dck, dck_light]
        code += '  dockerTags={'+f"{tags}"+"}\n"
    else:
        code += '  dockerTags={[]}\n'
    
    # Handle packages resources
    if 'packages' in version_data['resources']:
        code += '  packages={[\n'
        for pkg_trgt, pkg_url in version_data['resources']['packages'].items():
            code += f'    {{ target: "{pkg_trgt}", url: "{pkg_url}" }},\n'
        code += '  ]}\n'
    else:
        code += '  packages={[]}\n'
    code += '>\n'

    code += '</PlatformBlock>\n'
    
    return code

def md_header(position, title):
    return f"---\nsidebar_position: {position}\ntitle: {title}\n---\n\n{title}\n==================\n\n"

# Versionning (table) page -> minimal informations with links to platform for more technicities
def create_platform_page(data):
    md_content = md_header(10, "Platform Resources")
    for version in data.items():
        md_content += create_block_component(version)
    return md_content


# Platform (blocks) page -> full informations with all required links & informations, styled to match old "platform.simplicite.io"
def create_versionning_page(data):
    md_content = md_header(5, "Versionning")
    
    # Add table headers
    md_content += "| Version | Maintenance State | Maintenance End Date |\n"
    md_content += "|---------|-------------------|----------------------|\n"
    
    # Add table rows for each version
    for version_number, version_data in data.items():
        maintenance = version_data["maintenance"]
        
        # Determine support type based on maintenance state
        # You might want to adjust this logic based on your specific requirements
        if maintenance.lower() == "active":
            maintenance_state = "✅ Current"
        elif maintenance.lower() == "alpha":
            maintenance_state = "🚧 Alpha"
        elif maintenance.lower() == "shortterm":
            maintenance_state = "☑️ Short Term"
        elif maintenance.lower() == "longterm":
            maintenance_state = "☑️ Long Term (LTS)"
        elif maintenance.lower() == "expired":
            maintenance_state = "❌ Expired"
        else:
            maintenance_state = "none"

        maintenance_end_date = version_data.get("maintenance_end_date", "Unknown")
        if maintenance_end_date == "Unknown" and maintenance.lower()=="expired":
            maintenance_end_date = "Not applicable"
        # Add table row
        md_content += f"| [{version_number}]({f'/resources/platform_resources#{get_anchor(version_number)}'}) | {maintenance_state} | {prettier_date(maintenance_end_date)} |\n"
    
    return md_content

def get_anchor(version_number):
    # Create an anchor link for the version number
    return version_number.replace(".", "-")

# Prettier characteristics
def pretty_maintenance(maintenance):
    match maintenance:
        case 'alpha':
            return "🚧 Alpha"
        case 'active':
            return "✅ Current"
        case 'shortterm':
            return "☑️ Short Term"
        case 'longterm':
            return "☑️ LTS"
        case 'expired':
            return "❌ Expired"
        case _:
            return maintenance

def prettier_anchor(version):
    match version[1]['maintenance']:
        case 'alpha':
            return f"🚧 {version[0]} - alpha"
        case 'active':
            return f"✅ {version[0]} - current"
        case 'shortterm':
            return f"☑️ {version[0]}"
        case 'longterm':
            return f"☑️ {version[0]} - LTS"
        case 'expired':
            return f"❌ {version[0]}"
        case _:
            return version[0]

def prettier_date(date):
    try:
        date_obj = datetime.strptime(date, '%Y-%m-%d')
        return date_obj.strftime("%A, %B %d, %Y")
    except ValueError:
        return date



# JSON handling methods
def parse_json_file(json_file_path):
    try:
        with(open(json_file_path, 'r')) as json_file:
            data = json.load(json_file)
            return data
    except FileNotFoundError:
        print(f"Error: File {json_file_path} not found.")
        sys.exit(1)
    except json.JSONDecodeError:
        print(f"Error: File {json_file_path} is not a valid JSON file.")
        sys.exit(1)


def extract_platform_versions(data):
    if 'platform' not in data:
        print("Error: 'platform' key not found in the JSON data.")
        sys.exit(1)
    return data['platform']



def main():
    versionning_target = "./docs/resources/versions_table.md"
    platform_target = "./docs/resources/platform_resources.md"
    if len(sys.argv) > 1:
        json_source = sys.argv[1]
        data = parse_json_file(json_source)
        platform_data = extract_platform_versions(data)

        platform = create_platform_page(platform_data)
        with open(platform_target, 'w',encoding='utf-8') as p:
            p.write(platform)

        versionning = create_versionning_page(platform_data)
        with open(versionning_target, 'w', encoding='utf-8') as v:
            v.write(versionning)
        
    else:
        print("No JSON data file provided.")

if __name__ == "__main__":
    main()
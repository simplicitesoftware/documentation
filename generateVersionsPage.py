import requests
import json
import os
from collections import OrderedDict

URL="https://platform.simplicite.io/versions.json"
OUTPUT_DIR = "docs/versions"
OUTPUT_FILE = f"{OUTPUT_DIR}/versions.md"

def fetch_data():
    """Fetch data from the given URL and return it as a JSON object."""
    try:
        r = requests.get(URL)
        r.raise_for_status()  # Raise an error for bad responses
        data = r.json()['platform']

        vmap = OrderedDict()

        for v, d in data.items():
            vmap[v] = d

        return vmap 
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None
    
def get_java_resources(data):
    java = {
        "base": [],
        "light": [],
        "full": [],
    }

    resources = data["resources"]
    
    if 'doc' in resources:
        java["base"].append({"name":"Documentation", "url":resources["doc"]["java"]})
    if 'dependencies' in resources:
        deps = resources["dependencies"]
        java["light"].append({"name":"Dependencies (Light)", "url":deps["java_light"]})
        java["full"].append({"name":"Dependencies (Full)", "url":deps["java"]})
    if 'maven' in resources:
        mav = resources["maven"]
        java["base"].append({"name":"Maven Site", "url":mav["site"]})
        java["base"].append({"name":"Maven Repo", "url":mav["repository"]})
    
    return java

def get_js_resources(data):
    js = {
        "base": [],
    }
    resources = data["resources"]

    if 'doc' in resources:
        js["base"].append({"name":"Documentation", "url":resources["doc"]["js"]})
    
    if 'dependencies' in resources:
        deps = resources["dependencies"]
        js["base"].append({"name":"Dependencies", "url":deps["js"]})
        js["base"].append({"name":"Licenses", "url":deps["js_licenses"]})

    return js 

def get_audit_resources(data):
    audit = {
        "light": [],
        "full": [],
    }

    resources = data["resources"]
    if 'dependencies' in resources:
        deps = resources["dependencies"]
        audit["light"].append({"name":"Report (Light)", "url":deps["audit_light"]})
        audit["full"].append({"name":"Report (Full)", "url":deps["audit"]})

    return audit

def get_docker_infos(data):
    docker = {
        "light": [],
        "full": [],
    }
    resources = data["resources"]

    if 'docker' in resources:
        dock = resources["docker"]
        if ('image_light' in dock):
            docker["light"].append({"name":format_image_tag(dock["image_light"]), "value":dock["image_light"]})
        if ('info_light' in dock):
            docker["light"].append({"name":"Registry (Light)", "value":dock["info_light"]})
        if ('image' in dock):
            docker["full"].append({"name":format_image_tag(dock["image"]), "value":dock["image"]})
        if ('info' in dock):
            docker["full"].append({"name":"Registry (Full)", "value":dock["info"]})

    return docker

def format_image_tag(tag):
    split = tag.split("/")
    t = split[len(split) - 1].split(":")
    return t[len(t) - 1]

def generate_block(version, maintenance, supportType, lastDate, release, firstDate, javaResources, jsResources, auditResources, dockerInfo):
    """Generate the PlatformBlock component for the given informations"""    
    return f'<PlatformBlock version="{version}" maintenance="{maintenance}" supportType="{supportType}" lastDate="{lastDate}" release="{release}" firstDate="{firstDate}" javaResources={{{javaResources}}} jsResources={{{jsResources}}} auditResources={{{auditResources}}} dockerInfo={{{dockerInfo}}}/>\n'


def generate_markdown():
    """Generate the Markdown file with anchors and PlatformBlock blocks"""
    versions = fetch_data()
    if not versions:
        print("Failed to fetch versions data.")
        return
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(generate_header())
        f.write("<VersionsTable/>\n\n")

        for version, data in versions.items():
            f.write(f"## {prettier_anchor(version, data['maintenance'], data['support_type'])}\n\n")
            
            # Format and write the PlatformBlock component
            block = generate_block(
                version,
                data['maintenance'],
                data['support_type'],
                data['date'],
                data['version'],
                data['initial_release_date'],
                get_java_resources(data),
                get_js_resources(data),
                get_audit_resources(data),
                get_docker_infos(data)
            )

            f.write(f"{block}\n\n")

        print(f"Successfully generated {OUTPUT_FILE} with {len(versions)} versions.")

def generate_header():
    """Generate the header for the Markdown file."""
    return "---\nsidebar_position: 3\ntitle: Versions\n---\n\nVersions\n=========\n\n"

def prettier_anchor(version, maintenance, supportType):
    """Generate a prettier anchor for the version."""
    anchor = f"{version} {maintenance}-{supportType}"
    match maintenance:
        case "alpha":
            anchor = f"🚧 {version} Alpha"
        case "active":
            if (supportType == "longterm"):
                anchor = f"☑️ {version} Long Term Release"
            elif (supportType == "shortterm"):
                anchor = f"☑️ {version} Short Term Release"
            else:
                anchor = f"✅ {version} Current"
        case "expired":
            anchor = f"❌ {version}"
            if (supportType=="longterm"):
                anchor += " LTS"
            elif (supportType=="shortterm"):
                anchor += " STS"
            anchor += " Expired"
    return anchor
    
if __name__ == "__main__":
    generate_markdown()
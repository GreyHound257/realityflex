import os

# Files to ignore (dependencies, builds, system files)
IGNORE_DIRS = {'node_modules', 'build', 'dist', '.git', '.vscode', 'coverage'}
# File types to include
INCLUDE_EXTS = {'.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.html', '.json'}

def combine_files():
    with open('full_project_code.txt', 'w', encoding='utf-8') as outfile:
        # Walk through all folders
        for root, dirs, files in os.walk("."):
            # Modify dirs in-place to skip ignored directories
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
            
            for file in files:
                ext = os.path.splitext(file)[1]
                # Only grab source code and config files, skip large lock files
                if ext in INCLUDE_EXTS and file != 'package-lock.json':
                    filepath = os.path.join(root, file)
                    outfile.write(f"\n\n{'='*20}\nFILE: {filepath}\n{'='*20}\n\n")
                    try:
                        with open(filepath, 'r', encoding='utf-8') as infile:
                            outfile.write(infile.read())
                    except Exception as e:
                        outfile.write(f"[Error reading file: {e}]")

if __name__ == "__main__":
    combine_files()
    print("Done!")
import os
import shutil

cache_folders = ["__pycache__", ".pytest_cache", ".ruff_cache"]


def delete_cache_folders(directory: str) -> None:
    for root, dirs, files in os.walk(directory):
        for dir_name in dirs:
            if dir_name in cache_folders:
                pycache_path = os.path.join(root, dir_name)

                try:
                    shutil.rmtree(pycache_path)
                    print(f"Deleted: {pycache_path}")
                except Exception as e:
                    print(f"Error deleting {pycache_path}: {e}")


if __name__ == "__main__":
    start_directory = "../"

    delete_cache_folders(start_directory)

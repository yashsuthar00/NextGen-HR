import os
import subprocess
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time

class ChangeHandler(FileSystemEventHandler):
    def on_modified(self, event):
        # Only react to changes in Python files and ignore others
        if event.is_directory or not event.src_path.endswith('.py'):
            return
        print(f"Change detected: {event.src_path}. Restarting run.py...")
        try:
            subprocess.run(["python", "run.py"], check=True)
        except subprocess.CalledProcessError as e:
            print(f"Error occurred while running run.py: {e}. Waiting for further changes...")

if __name__ == "__main__":
    path = os.path.dirname(os.path.abspath(__file__))
    # Start run.py immediately
    try:
        subprocess.run(["python", "run.py"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error occurred while running run.py: {e}. Waiting for further changes...")

    event_handler = ChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, path=path, recursive=True)
    print(f"Watching for changes in {path}...")
    try:
        observer.start()
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

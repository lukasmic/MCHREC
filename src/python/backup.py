from __future__ import print_function
import json
import os
import os.path
import datetime
import subprocess
import time
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

SCOPES = ['https://www.googleapis.com/auth/drive.file']


def generate_backup_filename():
    return f"{os.getenv('MYSQL_DATABASE')}_{datetime.datetime.now().strftime('%Y-%m-%d')}.sql"


def perform_backup():
    # Backup database
    db_name = os.getenv('MYSQL_DATABASE')
    db_user = os.getenv('MYSQL_USER')
    db_password = os.getenv('MYSQL_PASSWORD')
    db_hostname = os.getenv('MYSQL_HOST')
    db_port = os.getenv('MYSQL_PORT')
    backup_filename = generate_backup_filename()
    backup_command = f"mysqldump -h {db_hostname} -P {db_port} -u {db_user} -p{db_password} {db_name} > {backup_filename}"
    subprocess.run(backup_command, check=True, shell=True)
    return backup_filename


def upload_to_drive(backup_filename):
    # Trying to get credentials.json path correct
    # Load the credentials from an environment variable
    credentials_json_string = os.getenv('GOOGLE_APPLICATION_CREDENTIALS_JSON')
    credentials_dict = json.loads(credentials_json_string)

    # Write the credentials to a file
    credentials_path = 'credentials.json'
    with open(credentials_path, 'w') as credentials_file:
        json.dump(credentials_dict, credentials_file)

    creds = None
    # The file token.json stores the user's access and refresh tokens, and is created automatically when the authorization flow completes for the first time.
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(credentials_path, SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    service = build('drive', 'v3', credentials=creds)

    # Call the Drive v3 API
    file_metadata = {'name': backup_filename, 'mimeType': 'application/octet-stream', 'parents': [os.getenv('DRIVE_FOLDER_ID')]}
    media = MediaFileUpload(backup_filename, mimetype='application/octet-stream', resumable=True)
    file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()

    # Assume `file` is the response from the upload attempt
    if 'id' in file:
        print('Upload successful, file ID:', file.get('id'))
        try:
            safe_delete_file(backup_filename)
        except PermissionError as e:
            print(f"Error deleting file {backup_filename}: {e}")
    else:
        print("Upload failed, not deleting file.")


def safe_delete_file(filename, max_attempts=2, wait_seconds=1):
    """Attempt to delete a file with retries."""
    for attempt in range(max_attempts):
        try:
            os.remove(filename)
            print(f"Attempt {attempt+1}: Backup file {filename} successfully deleted.")
            return  # Exit the function upon successful deletion
        except PermissionError as e:
            print(f"Attempt {attempt+1}: Error deleting file {filename}: {e}")
            time.sleep(wait_seconds)  # Wait before retrying

    # After all attempts, check if the file still exists
    if os.path.exists(filename):
        print(f"Failed to delete file {filename} after {max_attempts} attempts.")
    else:
        print(f"Backup file {filename} successfully deleted after retries.")


if __name__ == '__main__':

    try:
        backup_filename = perform_backup()
        print(f"Backup successful: {backup_filename}")
        upload_to_drive(backup_filename) # upload the backup
    except subprocess.CalledProcessError as e:
        print(f"Error during backup: {e}")
    except PermissionError as e:
        print(f"Error deleting file {backup_filename}: {e}")

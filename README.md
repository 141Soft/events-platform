# Events Platform

## This is the top level README

### About
This project aims to provide a small platform for browsing and signing up for events via the google calendar api. Admin level accounts are able to create additional events, and user level accounts are able to browse these events by their name and tag.

### Setup
Running this project locally requires a copy of the backend server found here: https://github.com/141Soft/events-platform-server

Details about the backend server can be found in it's README.md

Before running this project it is recommended to configure the environment variable:
- VITE_GOOGLE_CLIENT_ID   Which is an api token for linking to google cloud services
- VITE_API_URL  Which corresponds to the backend server

Additionally you will need to set up your google cloud scopes to allow read and write access for the calendar api

When this is done you can simply:

- npm install
- npm run dev
OR
- npm run build

After which the site should be ready for use.

### Usage
The user interface for the site is simple, users are presented with a search bar and a dropdown for search tags. These are used to filter the cards shown in the scrolling event view. Clicking on an event will open up it's details and lock the event view scrolling until it is closed. From the event details the user can view details about the vent, and can sign up through button, should a user not currently have their google account linked they will be prompted to do so. Additionally the accounts button in the top left allows users to preemptively link or unlink their google account.

Events can be added by signing in to a staff account through the account screen, after which an add event button is placed in line with the search bar. Clicking this button brings up a simple form that will configure the event to be added, this is sent in the correct format to the server.

### Version
Checked against node v23.4.0


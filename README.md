# Events Platform

## This is the top level README

### About
This project aims to provide a small platform for browsing and signing up for events via the google calendar api. Admin level accounts are able to create additional events, and user level accounts are able to browse these events by their name and tag.

### Viewing live
A demo of this project is hosted at https://event-platform-demo.netlify.app
An admin account is provided with the following credentials:
- email: admin@example.com
- password: password

Some considerations:
- As this is a demo project the assosciated googleApi is not verified so you may encounter a warning message when attempting to connect your google account. To bypass this, click '<ins>Advanced</ins>' and then '<ins>Go to event-platform-demo.netlify.app (unsafe)</ins>', the scopes required are listed below in the setup section.
- The live version is provided with a set of placeholder events to demonstrate the core functionality, however should these events be deleted when testing the admin functions the site may appear empty temporarily until I reseed them.

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
The user interface for the site is simple, users are presented with a search bar and a dropdown for search tags. These are used to filter the cards shown in the scrolling event view. Clicking on an event will open up it's details and lock the event view scrolling until it is closed(on mobile users can continue to swipe).

From the event details the user can:
- View the title, date, time, description and body of the event.
- Add the event to their calendar.
- Sign up for the event.

If any actions require the user to have a linked google account they will be prompted to do this.

Additionally the accounts button in the top left allows users to:
- Link or unlink their google account.
- When linked, view a list of events they have signed up for.
- Access the admin login function.

To end viewing of a user's events you can either toggle the View Events button in the account dropdown, or click the ✕ that will have appeared next to the events counter.

Events can be added by signing in to an admin account through the Staff Login button, after which an add event button is placed in line with the search bar. Clicking this button brings up a simple form that will configure the event to be added, this is sent in the correct format to the server.

### Version
Checked against node v23.4.0


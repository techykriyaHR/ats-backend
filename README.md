# Backend: FullSuite Application Tracking System (ATS)

## Overview

This document provides a comprehensive plan for the development and deployment of FullSuite's Application Tracking System (ATS). It outlines the structured approach to designing, building, and implementing the ATS to meet the company’s talent acquisition needs.

## Scope and Requirements

### Functional Requirements

1. **User Authentication & Authorization**: Different access levels for lead talent acquisition and interviewers.
2. **Application Tracking & Management**: Ability for lead talent acquisition to track and manage applicants' stages (e.g., pre-screening, interview, job offer) and status (e.g., test sent, interview scheduled).
3. **Interview Scheduling**: Recruiters can schedule interviews and notify applicants via email.
4. **Notification System**: Recruiters can send email notifications for application status updates.
5. **Search & Filter Applicants**: Lead talent acquisition can filter applicants based on stages, status, dates, and positions applied.
6. **Role-based Access Control**: Different roles with varying permissions.
7. **Analytics**: Lead talent acquisition has access to metrics and application trend graphs.
8. **Integration with SuiteLifer's Website**: The ATS is integrated with the SuiteLifer website, specifically its career feature.

### Non-Functional Requirements

1. **Scalability**: The system should support increasing numbers of users and data.
2. **Security**: Implement data encryption, access controls, and ensure regulatory compliance.
3. **Performance**: Ensure fast response times and efficient data processing.

## Methodology & Structure

### System Development Timeline

- A detailed development timeline will be provided to track progress and ensure timely delivery of the ATS.

### Development Technologies

- **Prototyping**: Figma will be used to create the sitemap and high-fidelity prototype.
- **Backend**: Node.js with Express.js.
- **Frontend**: React.js.
- **Database**: MySQL for relational data storage, designed using MySQL Workbench and dbdiagram.io.

### System Architecture

1. **Frontend**: React.js (Client-side).
2. **Backend**: Node.js with Express.js (Server-side).
3. **Database**: MySQL (Relational Database).
4. **API**: RESTful API (with Express.js simplifying endpoint creation).
5. **Communication**: HTTP/HTTPS for REST API calls or WebSockets for real-time features.

### Client-Server Interaction

- **Frontend**: React sends HTTP requests (GET, POST, PUT, DELETE) to the backend via Axios.
- **Backend**: Express.js receives requests, interacts with MySQL using `mysql2` and responds with JSON data.
- **Database**: MySQL processes queries using a connection pool for improved performance.
- **Frontend Update**: The React app updates its state and re-renders the UI with the retrieved data.

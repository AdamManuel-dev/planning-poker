import { Remark } from 'react-remark';

const ExampleMarkdown = () => (
  <Remark>{`
  # Multiple price points per event (inventories)

  Value: 17.8
  Time: 8
  Status: In progress
  Epic: Ticket Purchasing
  Assigned To: Adam Manuel
  Finish By: September 6, 2024
  Value/Time: 2.225
  
  # Subtasks
  
  - [x]  Have multiple inventories connect to a single event
      - [x]  With individual totals for tickets available
  - [ ]  Charge on stripe with the correct line item name, and price
  
  ## User Roles
  
  - event organizer
  - user
  
  ## User Stories
  
  As an event organizer, I want to update ticket availability in real-time, so attendees have accurate information.
  
  ---
  
  As a user, I want to see the current ticket availability status, so I know if I can purchase tickets for an event.
  
  ---
  
  As an event organizer, I want an embedded ticket widget on my event page, so visitors can easily buy tickets without leaving the site.
  
  ---
  
  As a user, I want to purchase tickets through an embedded widget on partner websites, so I have a seamless experience.
  
  ---
  
  As a user, I want to purchase tickets directly within the app or website, so I can complete the transaction seamlessly.
  
  ---
  
  As a user, I want to view different ticket options and their pricing, so I can choose the best option for my needs.
  
  ---
  
  As an event organizer, I want to display clear ticket options and pricing on the event page, so potential attendees can make informed decisions.
  
  ---
  
  As a user, I want to see the sales tax information associated with my ticket purchase, so I understand the total cost.
  
  ---
  
  As an event organizer, I want users to be able to purchase tickets natively on the platform, so they don't need to leave the site to complete their purchase.
  
  ---
  
`}</Remark>
);

export default ExampleMarkdown;

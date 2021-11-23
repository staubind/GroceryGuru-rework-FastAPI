import React from 'react';

function AboutPage() {
  /*
    Displays some info about this project for the purpose of a presentation.
  */
  return (
      <center>
        <container>
          <h2>Tech Stack</h2>
            <ul style={{listStyleType: "none"}}>
              <li>HTML</li>
              <li>CSS</li>
              <li>Bootstrap</li>
              <li>React</li>
              <li>Redux</li>
              <li>Redux-Saga</li>
              <li>Node.js</li>
              <li>Express</li>
              <li>PostgreSQL</li>
              <li>Spoonacular's API</li>
            </ul>
          <h2>Largest Challenge</h2>
          <ul style={{listStyleType: "none"}}>
            <li>Working around tight limitations with Spoonacular's API</li>
          </ul>
          <h2>What's Next?</h2>
          <ul style={{listStyleType: "none"}}>
            <li>Add advanced search and user settings and nutritional information</li>
          </ul>
          <h2>A Special Thanks To</h2>
          <ul style={{listStyleType: "none"}}>
            <li>Edan, Matt, and the staff of Prime Digital Academy</li>
            <li>My Cohort</li>
            <li>My girlfriend, Cate</li>
          </ul>
        </container>
        </center>

  );
}

export default AboutPage;

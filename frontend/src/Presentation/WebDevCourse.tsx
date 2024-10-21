import styled from "@emotion/styled";
import React, { useState, useCallback } from "react";

interface Slide {
  title: string;
  content: React.ReactNode;
}

const CourseContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  width: 100vw;
  padding: 2rem;
  box-sizing: border-box;
  overflow: hidden;
`;

const SlideContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  overflow-y: auto;
`;

const Navigation = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 2rem;
`;

const NavButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SlideTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const SlideText = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
`;

const CodeBlock = styled.pre`
  padding: 1rem;
  border-radius: 5px;
  text-align: left;
  width: 100%;
  overflow-x: auto;
`;

const FullscreenButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: opacity 0.3s;
  background-color: rgba(128, 128, 128, 0.5);
  color: white;
  &:hover {
    opacity: 0.8;
  }
`;

const WebDevCourse: React.FC = () => {
  const slides: Slide[] = [
    {
      title: "Web Development Journey",
      content: (
        <SlideText>
          Welcome to your web development journey! We'll start from the basics
          and progressively move towards more advanced concepts. By the end of
          this course, you'll have a solid foundation in both frontend and
          backend development, enabling you to create modern web applications.
        </SlideText>
      ),
    },
    {
      title: "HTML: The Building Blocks",
      content: (
        <>
          <SlideText>
            HTML is the skeleton of every webpage. It provides structure and
            meaning to your content. Let's look at some key elements:
          </SlideText>
          <CodeBlock>
            {`<header>
  <h1>Welcome to My Site</h1>
  <nav>
    <ul>
      <li><a href="#home">Home</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h2>Article Title</h2>
    <p>This is the content of your article...</p>
  </article>
</main>

<footer>
  <p>&copy; 2023 My Website</p>
</footer>`}
          </CodeBlock>
          <SlideText>
            Notice how HTML5 semantic tags like &lt;header&gt;, &lt;nav&gt;,
            &lt;main&gt;, &lt;article&gt;, and &lt;footer&gt; give structure and
            meaning to the content.
          </SlideText>
        </>
      ),
    },
    {
      title: "CSS: Bringing Design to Life",
      content: (
        <>
          <SlideText>
            CSS transforms your HTML structure into a visually appealing design.
            Let's explore some modern CSS techniques:
          </SlideText>
          <CodeBlock>
            {`/* Using CSS variables for consistent theming */
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --text-color: #333;
}

/* Flexbox for layout */
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* CSS Grid for complex layouts */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

/* Responsive design with media queries */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}`}
          </CodeBlock>
          <SlideText>
            Modern CSS allows for flexible, responsive designs that work across
            various device sizes.
          </SlideText>
        </>
      ),
    },
    {
      title: "JavaScript: Adding Interactivity",
      content: (
        <>
          <SlideText>
            JavaScript brings your web pages to life with interactivity. Here's
            an example of modern JavaScript (ES6+) in action:
          </SlideText>
          <CodeBlock>
            {`// Async function to fetch data
async function fetchUsers() {
  try {
    const response = await fetch('https://api.example.com/users');
    const users = await response.json();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// Using the fetch function with modern array methods
fetchUsers().then(users => {
  const activeUsers = users.filter(user => user.isActive);
  const userNames = activeUsers.map(user => user.name);
  
  console.log('Active users:', userNames);
});

// Event listener using arrow function
document.getElementById('myButton').addEventListener('click', () => {
  console.log('Button clicked!');
});`}
          </CodeBlock>
          <SlideText>
            Modern JavaScript features like async/await, arrow functions, and
            array methods make your code more readable and efficient.
          </SlideText>
        </>
      ),
    },
    {
      title: "Single Page Applications (SPAs)",
      content: (
        <SlideText>
          SPAs have revolutionized web development by providing a smoother,
          app-like experience. Frameworks like React, Angular, and Vue.js enable
          developers to create complex applications that update dynamically
          without full page reloads. These frameworks use a component-based
          architecture, allowing for reusable and maintainable code. SPAs often
          work in conjunction with RESTful APIs to create full-featured web
          applications.
        </SlideText>
      ),
    },
    {
      title: "React: Building User Interfaces",
      content: (
        <>
          <SlideText>
            React is a popular library for building user interfaces. It uses a
            component-based architecture and a virtual DOM for efficient
            updates. Here's a simple React component:
          </SlideText>
          <CodeBlock>
            {`import React, { useState, useEffect } from 'react';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(\`https://api.example.com/users/\${userId}\`)
      .then(response => response.json())
      .then(data => setUser(data));
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
};

export default UserProfile;`}
          </CodeBlock>
          <SlideText>
            This component demonstrates React hooks (useState and useEffect) and
            conditional rendering.
          </SlideText>
        </>
      ),
    },
    {
      title: "Frontend vs Backend",
      content: (
        <SlideText>
          Web development is often divided into frontend and backend: Frontend
          focuses on the user interface and experience. It involves HTML, CSS,
          JavaScript, and frameworks like React. Frontend developers ensure that
          the website looks good and functions smoothly in the browser. Backend
          handles server-side logic, databases, and APIs. Languages like
          Node.js, Python, Ruby, or Java are commonly used. Backend developers
          work on data storage, security, and server-side business logic.
          Full-stack developers are proficient in both frontend and backend
          technologies, allowing them to work on all aspects of web application
          development.
        </SlideText>
      ),
    },
    {
      title: "APIs: Connecting Frontend and Backend",
      content: (
        <>
          <SlideText>
            APIs (Application Programming Interfaces) are crucial in modern web
            development. They allow the frontend to communicate with the backend
            and other services. RESTful APIs are common, but GraphQL is gaining
            popularity for its flexibility.
          </SlideText>
          <CodeBlock>
            {`// Example of using fetch to interact with an API
async function createUser(userData) {
  try {
    const response = await fetch('https://api.example.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    
    const newUser = await response.json();
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
  }
}`}
          </CodeBlock>
          <SlideText>
            Understanding how to work with APIs is essential for creating
            dynamic, data-driven web applications.
          </SlideText>
        </>
      ),
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
  };

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  }, []);

  return (
    <CourseContainer>
      <FullscreenButton onClick={toggleFullscreen}>
        {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      </FullscreenButton>
      <SlideContent>
        <SlideTitle>{slides[currentSlide].title}</SlideTitle>
        {slides[currentSlide].content}
      </SlideContent>
      <Navigation>
        <NavButton onClick={goToPrevSlide} disabled={currentSlide === 0}>
          &larr; Previous
        </NavButton>
        <NavButton
          onClick={goToNextSlide}
          disabled={currentSlide === slides.length - 1}
        >
          Next &rarr;
        </NavButton>
      </Navigation>
    </CourseContainer>
  );
};

export default WebDevCourse;

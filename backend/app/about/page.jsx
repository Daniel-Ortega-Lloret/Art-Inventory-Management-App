export default function AboutPage() {
  return (
    <main
      style={{
        padding: "2rem",
        maxWidth: "1000px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.7
      }}
    >
      <h1>About this page</h1>

      <p>
        This application is an art museum inventory management system created to
        manage a catalogue of artworks through a modern web interface. The system
        uses a React frontend built with Vite, a Next.js backend that provides
        REST API routes, and a MongoDB database for storing the artwork records.
        The purpose of the application is to allow staff users to browse, search,
        sort, view, add, edit, and delete artworks from the catalogue in an
        organised and user-friendly way.
      </p>

      <h2>How the application works</h2>

      <p>
        The application follows a client-server architecture. The frontend is a
        React application that runs in the browser and provides the user
        interface. When a user logs in or performs an action such as searching
        for art, viewing an artwork, creating a new entry, editing a
        record, or deleting an existing one, the frontend sends HTTP requests to
        the backend API.
      </p>

      <div style={{ textAlign: "center", margin: "2rem 0" }}>
        <img
          src="/CaDiagram.drawio.png"
          alt="Diagram showing how the art inventory application works"
          style={{
            maxWidth: "100%",
            height: "auto",
            border: "1px solid #ccc",
            borderRadius: "8px"
          }}
        />

        <p style={{ marginTop: "0.75rem" }}>
          <strong>Figure 1:</strong> Diagram of Application Architecture
        </p>
      </div>

      <p>
        The backend is implemented in Next.js and exposes REST endpoints for
        authentication and artwork management. These endpoints validate the
        request, process the required logic, and interact with MongoDB through
        Mongoose models. MongoDB stores the artwork data imported from the MoMA
        dataset in JSON format. The backend then sends the requested data back to
        the frontend as JSON responses, and the frontend updates the interface
        accordingly.
      </p>

      <p>
        Authentication is handled using JSON Web Tokens. When a user logs in, the
        backend verifies the credentials and returns a token. The frontend stores
        this token and includes it in later requests so that protected operations
        such as creating, editing, and deleting artworks can only be performed by
        authenticated users.
      </p>

      <h2>Technologies used in the project</h2>
      <ul>
        <li>
          <strong>React with Vite:</strong> used to build the frontend user
          interface and provide a fast development environment
        </li>
        <li>
          <strong>React Router:</strong> used for frontend navigation between
          pages such as login, register, artwork inventory, edit, and view pages
        </li>
        <li>
          <strong>Axios:</strong> used in the frontend to send HTTP requests to
          the backend API for authentication and CRUD operations
        </li>
        <li>
          <strong>Next.js:</strong> used for the backend server and API route
          handlers
        </li>
        <li>
          <strong>MongoDB:</strong> used as the database for storing artwork and
          user information
        </li>
        <li>
          <strong>Mongoose:</strong> used to define schemas and interact with
          MongoDB
        </li>
        <li>
          <strong>JWT (JSON Web Tokens):</strong> used to authenticate users and
          protect backend routes
        </li>
        <li>
          <strong>Docker:</strong> used to run the MongoDB instance in a containerized
          environment
        </li>
      </ul>

      <h2>Main limitations and weaknesses</h2>
      <ul>
        <li>
          The authentication system is functional but still basic. It is suitable
          for this project, but it does not include more advanced features such
          as password reset, refresh tokens, or account recovery
        </li>
        <li>
          The application currently focuses on staff-only inventory management,
          so it does not include broader user roles or more detailed access
          control
        </li>
        <li>
          Although search, pagination, and sorting are implemented, performance
          may become slower with very large datasets unless more database indexes
          and backend optimizations are added
        </li>
        <li>
          Error handling and validation have been implemented, but there is still
          room for more polished feedback and a more advanced user experience
        </li>
        <li>
          The design is functional and clear, but it could be made more visually
          appealing with additional styling, and animations
        </li>
      </ul>

      <h2>Alternative approaches and technologies</h2>
      <p>
        Several alternative approaches could have been used to build this
        application. The backend could have been implemented with Express instead
        of Next.js, which would give more manual control over the server
        structure. However, Next.js was chosen because it provides a convenient
        way to organize API routes and pages in the same backend project
      </p>

      <p>
        On the frontend, the project could also have used another framework such
        as Angular or Vue, but React was selected because it integrates well with
        component-based design and works efficiently with Vite. For data
        fetching, the built-in Fetch API could have been used instead of Axios,
        but Axios provided a cleaner setup for handling JSON requests and JWT
        headers
      </p>

      <p>
        In terms of authentication, session-based authentication could have been
        used instead of JWT. Session-based authentication is often simpler for
        traditional server-rendered applications, but JWT was chosen because it
        works well with a separate frontend and backend communicating through
        HTTP requests
      </p>

      <p>
        Finally, the database layer could have used a different database system
        such as PostgreSQL or MySQL, but MongoDB was a good fit for this project
        because the source dataset was already in JSON format and could be
        mapped naturally into document-based records. Additionally, the data is
        unstructured and some entries have more fields than others so a NoSQL DB
        was a good fit here
      </p>
    </main>
  );
}
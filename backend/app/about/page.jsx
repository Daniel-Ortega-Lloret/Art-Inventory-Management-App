export default function AboutPage() {
  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
      <h1>About this page</h1>

      <p>
        This application is an art museum inventory management system built with
        a React frontend and a Next.js backend connected to MongoDB.
      </p>

      <h2>How the application works</h2>
      <p>
        Users can browse and view art, add new artworks, update existing entries,
        and delete artworks through REST API endpoints.
      </p>

      <h2>Technologies used</h2>
      <ul>
        <li>React with Vite for the frontend</li>
        <li>Next.js for backend routes and server-rendered pages</li>
        <li>MongoDB for data storage</li>
        <li>Mongoose for database modelling</li>
        <li>JWT for authentication</li>
        <li>Docker Compose for MongoDB setup</li>
      </ul>

      <h2>Main limitations</h2>
      <ul>
        <li>Authentication and authorization are basic in the current version</li>
        <li>Search and filtering can be improved further</li>
        <li>Large dataset performance may require indexing and optimization</li>
      </ul>

      <h2>Alternative approaches</h2>
      <p>
        The backend could also have been built with Express instead of Next.js,
        and authentication could have been handled with session-based auth instead
        of JWT.
      </p>
    </main>
  );
}
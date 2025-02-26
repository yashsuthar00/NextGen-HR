import "./App.css";

function App() {
  return (
    <>
      <form
        action="http://localhost:5000/upload"
        method="POST"
        encType="multipart/form-data"
      >
        <input type="file" name="file" required />
        <button type="submit">Upload</button>
      </form>
    </>
  );
}

export default App;

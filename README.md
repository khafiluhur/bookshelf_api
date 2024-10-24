# BOOKSHELF API

**Bookshelf API** is a backend service built with Node.js using the Hapi framework. This API allows you to manage books, providing functionality to create, read, update, and delete book records.

## Features

- **Create**: Add a new book.
- **Read**: Retrieve book information.
- **Update**: Modify existing book details.
- **Delete**: Remove a book from the database.

## Requirements

- Node v18.13.0
- Hapi
- Nanoid

## Library & Documentation Library

- @hapi/hapi (Service Api) (https://www.npmjs.com/package/@hapi/hapi)
- nanoid (Generade ID) (https://www.npmjs.com/package/nanoid)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bookshelf_api.git
   cd bookshelf_api
   ```
2. Set up project:
   ```bash
   npm install
   ```

## Running the Application

1. Make sure your books.json is empty.
2. Run the application:
    ```bash
    npm run start-dev
    ``` 
    or 
    ```bash 
    npm start
    ```
3. The server will start on the configured port (default: 9000).

## API Endpoints
Example Postman Collection : in project and name folder BookshelfAPITestCollectionAndEnvironment

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

### Instructions for Use
1. **Fill in the repository link**: Update the `git clone` line with the actual repository URL.
2. **Modify any sections** as necessary to fit your project's specifics, especially in the API Endpoints section if there are more or different endpoints.

This single markdown document provides a comprehensive overview of your project, setup instructions, API usage, testing, and contribution guidelines. Let me know if you need any further modifications or additions!

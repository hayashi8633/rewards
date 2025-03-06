//imports
const PORT = process.env.PORT;
import { app } from './app.js';

//we have to start the server in seperate file
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

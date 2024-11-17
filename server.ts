import app from "./src/app";
import http from "http";

let httpServer: http.Server = http.createServer(app);

httpServer.listen(process.env.PORT, () => {
	console.info("Server is running on port: " + process.env.PORT);
});

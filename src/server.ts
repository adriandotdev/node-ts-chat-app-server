import httpServer from "./app";

httpServer.listen(process.env.PORT, () => {
	console.info("Server is running on port: " + process.env.PORT);
});
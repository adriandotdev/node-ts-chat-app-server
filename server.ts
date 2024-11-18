import httpServer from "./src/app";

httpServer.listen(process.env.PORT, () => {
	console.info("Server is running on port: " + process.env.PORT);
});

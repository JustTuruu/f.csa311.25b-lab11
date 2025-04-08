package game;

import java.io.IOException;
import java.util.Map;
import fi.iki.elonen.NanoHTTPD;

public class App extends NanoHTTPD {

    public static void main(String[] args) {
        try {
            new App();
        } catch (IOException ioe) {
            System.err.println("Couldn't start server:\n" + ioe);
        }
    }

    private Game game;
    private Game previousGame; // For undo functionality

    /**
     * Start the server at :8080 port.
     * @throws IOException
     */
    public App() throws IOException {
        super(8080);

        this.game = new Game(); 

        start(NanoHTTPD.SOCKET_READ_TIMEOUT, false);
        System.out.println("\nRunning on http://localhost:8080\n");
    }

    @Override
    public Response serve(IHTTPSession session) {
        String uri = session.getUri();
        Map<String, String> params = session.getParms();
        
        Response response;
        
        if (uri.equals("/newgame")) {
            this.previousGame = this.game; // Store current game for potential undo
            this.game = new Game();
            GameState gameplay = GameState.forGame(this.game);
            response = newFixedLengthResponse(Response.Status.OK, "application/json", gameplay.toString());
        } else if (uri.equals("/play")) {
            this.previousGame = this.game; // Store current game for potential undo
            int x = Integer.parseInt(params.get("x"));
            int y = Integer.parseInt(params.get("y"));
            this.game = this.game.play(x, y);
            GameState gameplay = GameState.forGame(this.game);
            response = newFixedLengthResponse(Response.Status.OK, "application/json", gameplay.toString());
        } else if (uri.equals("/undo")) {
            // Implement undo functionality
            if (this.previousGame != null) {
                this.game = this.previousGame;
                this.previousGame = null; // Can only undo once
            }
            GameState gameplay = GameState.forGame(this.game);
            response = newFixedLengthResponse(Response.Status.OK, "application/json", gameplay.toString());
        } else {
            response = newFixedLengthResponse(Response.Status.NOT_FOUND, "text/plain", "Not Found");
        }
        
        // Add CORS headers to allow cross-origin requests from the frontend
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.addHeader("Access-Control-Allow-Headers", "Content-Type");
        
        return response;
    }
}
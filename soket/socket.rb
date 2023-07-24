require 'socket'
require 'json'

# WebSocket server
server = TCPServer.new(3000)
puts "WebSocket server listening on port 3000..."

# Handshake response headers
HANDSHAKE_RESPONSE = <<~HTTP.freeze
  HTTP/1.1 101 Switching Protocols
  Upgrade: websocket
  Connection: Upgrade

HTTP

# Accept incoming connections
loop do
  socket = server.accept

  # Read the request headers
  request = socket.gets

  # Check if it's a WebSocket handshake request
  if request&.include?("Upgrade: websocket")
    # Send the handshake response to upgrade the connection
    socket.write(HANDSHAKE_RESPONSE)
    socket.flush

    # Create WebSocket connection
    while (frame = socket.gets)
      # Ignore ping and pong frames
      next if frame.start_with?("Ping:") || frame.start_with?("Pong:")

      # Send JSON data infinitely
      loop do
        data = { name: "random character" }
        socket.write(JSON.dump(data))
        socket.flush
        sleep 1
      end
    end
  end

  # Close the socket
  socket.close
end

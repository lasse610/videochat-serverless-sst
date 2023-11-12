export interface InitializeSocketConnectionMessage extends SocketMessage{
    data: {
        username: string
    }
}

interface SocketMessage {
    action: string,
    data: object
}


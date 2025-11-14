import { Injectable } from '@nestjs/common';
import { Player } from './domain/player';

@Injectable()
export class PlayerService {

    private players: Player[] = [];
    private idCounter = 1;

    createPlayer(name: string, color: string): Player {
        const newPlayer: Player = {
            id: this.idCounter++,
            name,
            color,
            units: [],
        };
        this.players.push(newPlayer);
        return newPlayer;
    }

    findall(): Player[] {
        return this.players;
    }

    findById(id: Player['id']): Player | undefined {
        return this.players.find(player => player.id === id);
    }

    deletePlayer(id: Player['id']): boolean {
        const index = this.players.findIndex(player => player.id === id);
        if (index !== -1) {
            this.players.splice(index, 1);
            return true;
        }
        return false;
    }

    updatePlayer(id: Player['id'], name: string, color: string): Player | undefined {
        const player = this.findById(id);
        if (player) {
            player.name = name;
            player.color = color;
            return player;
        }
        return undefined;
    }

}

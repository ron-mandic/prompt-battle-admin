import { v4 as uuidv4 } from 'uuid';
import {
	BOX_F_OFFSET,
	BOX_H_OFFSET,
	BOX_LENGTH,
	BOX_V_OFFSET,
	NUMBER_PLAYERS,
	PROMPT_BATTLE_ROUNDS_MAX,
	PROMPT_BATTLE_SCHEDULE_41
} from './constants';

export class Player {
	id: string;
	name: string | null;
	num: number;

	constructor(name: string | null, num: number) {
		this.id = `player:${uuidv4()}`;
		this.name = name;
		this.num = num;
	}

	setName(name: string): void {
		this.name = name;
	}
}

export class PromptBattle {
	id: string;
	currentRound: number;
	rounds: number;
	players: null | [Player, Player];
	challenges: string[];
	mode: 'P' | 'PS';

	constructor(players: null | [Player, Player], challenges: string[], mode: 'P' | 'PS') {
		this.id = `battle:${uuidv4()}`;
		this.currentRound = 1;
		this.rounds = PROMPT_BATTLE_ROUNDS_MAX;
		this.players = players;
		this.challenges = challenges;
		this.mode = mode;
	}
}

export class PromptTournament {
	__schedule__: string;
	__map__: Map<string, { id: string; port: string }>;

	currentRound: [string, number];
	tournamentSchedule;
	challenges: string[];
	players: Player[];
	battleMode: 'P' | 'PS';

	constructor(challenges: string[]) {
		this.__schedule__ = PROMPT_BATTLE_SCHEDULE_41;
		this.__map__ = new Map();

		this.currentRound = ['V', 0];
		this.tournamentSchedule = {
			V: new Array(4).fill(null),
			H: new Array(2).fill(null),
			F: new Array(1).fill(null)
		};
		this.challenges = challenges;
		this.players = [];
		this.battleMode = 'P';

		for (let i = 0; i < NUMBER_PLAYERS; i++) {
			const player = new Player(null, i);
			this.players.push(player);
		}

		this.initRounds();
		this.initTournamentSchedule();
	}

	join(id: string, data: { id: string; port: string }) {
		if (!this.__map__.has(id)) this.__map__.set(id, data);
	}

	leave(id: string) {
		this.__map__.forEach((_, key) => {
			if (key === id) {
				this.__map__.delete(key);
			}
		});
	}

	initRounds(args = [5, 4, 3, 1, 2, 0, 7, 6]) {
		if (args.length !== 8) throw new Error('initRounds: Invalid number of arguments');

		const box0 = `V${args[0]}${args[1]}XX`;
		const box1 = `V${args[2]}${args[3]}XX`;
		const box2 = `V${args[4]}${args[5]}XX`;
		const box3 = `V${args[6]}${args[7]}XX`;

		const vBoxes = `${box0},${box1},${box2},${box3};`;
		this.__schedule__ = vBoxes + this.__schedule__.slice(BOX_H_OFFSET);
	}

	initTournamentSchedule(
		args = [
			[5, 4],
			[3, 1],
			[2, 0],
			[7, 6]
		]
	) {
		const quarterFinals = this.tournamentSchedule.V.map((v, i) => {
			const players = [this.players[args[i][0]], this.players[args[i][1]]] as [Player, Player];
			const challenges = this.challenges.slice(i * 5, i * 5 + 5);
			const mode = 'P';

			const pB = new PromptBattle(players, challenges, mode);
			return pB;
		});

		this.tournamentSchedule.V = quarterFinals;
	}

	roundToArgs(box: string) {
		return [box[1], box[2], box[3], box[4]];
	}

	round(box: string, args: Array<number | string>): string {
		const arg0 = args[0] || box[1];
		const arg1 = args[1] || box[2];
		const arg2 = args[2] || box[3];
		const arg3 = args[3] || box[4];

		return `${box[0]}(${arg0},${arg1},${arg2},${arg3})`;
	}

	rounds(r: string, n: number, args?: Array<number | string>) {
		const V = 'V';
		const H = 'H';
		const F = 'F';

		if (n >= 4 && r === V) throw new Error('getRound: Invalid round number for V');
		if (n >= 2 && r === H) throw new Error('getRound: Invalid round number for H');
		if (n >= 1 && r === F) throw new Error('getRound: Invalid round number for F');
		if (args && args.length > 4) throw new Error('getRound: Invalid number of arguments');

		let i = 0;
		let offset = BOX_V_OFFSET;

		if (r === H) offset = BOX_H_OFFSET;
		if (r === F) offset = BOX_F_OFFSET;
		i = offset + BOX_LENGTH * n + 1 * n;

		const box = this.__schedule__.slice(i, i + BOX_LENGTH);
		if (args === undefined)
			if (!args)
				// Getter
				return box;

		// Setter
		const arg0 = args[0] || box[1];
		const arg1 = args[1] || box[2];
		const arg2 = args[2] || box[3];
		const arg3 = args[3] || box[4];

		const newBox = `${r}${arg0}${arg1}${arg2}${arg3}`;

		this.__schedule__ =
			this.__schedule__.slice(0, i) + newBox + this.__schedule__.slice(i + BOX_LENGTH);
		return this.__schedule__;
	}
}

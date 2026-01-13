import { Test, TestingModule } from '@nestjs/testing'; // narzędzia Nest do budowy modułu testowego
import { GameService } from './game.service'; // serwis, który testujemy
import { PlayerService } from 'src/player/player.service'; // zależność, którą zamokujemy
import { BoardService } from 'src/board/board.service'; // zależność, którą zamokujemy
import { UnitsService } from 'src/units/units.service'; // zależność, którą zamokujemy
import { PrismaService } from 'src/prisma/prisma.service'; // zależność, którą zamokujemy
import { TerrainType, HexTile, HexCoords } from 'src/board/domain/hex.types'; // typy planszy
import { Game } from './domain/game'; // model gry
import { Board } from 'src/board/domain/board'; // kontrakt planszy

describe('GameService', () => {
  let service: GameService; // instancja serwisu testowanego
  let playerServiceMock: { findById: jest.Mock }; // mock dla PlayerService

  beforeEach(async () => {
    // Tworzymy proste mocki (zachowania zastępcze) dla zależności.
    playerServiceMock = {
      findById: jest.fn(), // stub metody findById; później ustawimy jej zwroty
    };

    // Budujemy moduł testowy NestJS: rejestrujemy GameService i podkładamy mocki zamiast prawdziwych serwisów.
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService, // klasa, którą testujemy
        { provide: PlayerService, useValue: playerServiceMock }, // wstrzykujemy mock PlayerService
        { provide: BoardService, useValue: {} }, // puste mocki dla innych zależności
        { provide: UnitsService, useValue: {} },
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<GameService>(GameService); // pobieramy gotową instancję serwisu z modułu testowego
  });

  it('should be defined', () => {
    expect(service).toBeDefined(); // sanity check: serwis został poprawnie zbudowany
  });

  it('przesuwa jednostke na wskazane wspolrzedne, gdy pole jest przechodnie', async () => {
    // Ustawiamy dane docelowego pola, na ktore chcemy przesunac jednostke.
    const targetCoords: HexCoords = { q: 2, r: 3 };
    // Przygotowujemy pojedynczy kafelek planszy, ktory jest przechodni (passable = true).
    const tile: HexTile = {
      coords: targetCoords,
      terrain: TerrainType.Plain,
      passable: true,
      movementCost: 1,
    };
    // Plansza na potrzeby testu ma tylko jeden kafelek.
    const board: Board = {
      tiles: [tile],
    };

    // Tworzymy minimalny obiekt gry, ktory GameService trzyma w pamieci.
    const game: Game = {
      id: 1,
      player: {
        id: 1,
        name: 'Player',
        color: 'red',
        turn: true,
        units: [], // wymagane pole z klasy Player
        budget: 1000, // wymagane pole z klasy Player
      },
      playerArmy: [],
      enemy: {
        id: 2,
        name: 'Enemy',
        color: 'blue',
        turn: false,
        units: [], // wymagane pole z klasy Player
        budget: 1000, // wymagane pole z klasy Player
      },
      enemyArmy: [],
      board,
      phase: 'battle',
      createdAt: new Date(),
    };

    // Wstrzykujemy przygotowana gre do prywatnego pola service (trick testowy).
    (service as unknown as { games: Game[] }).games = [game];

    // Mock PlayerService: ma zwrocic gracza z jednostka, ktora posiada pozycje startowa.
    playerServiceMock.findById.mockResolvedValue({
      units: [
        {
          uniqueId: 99,
          position: { q: 0, r: 0 },
        },
      ],
    });

    // Wywolujemy ruch: oczekujemy, ze metoda zwroci wspolrzedne docelowe, bo pole jest przechodnie.
    const result = await service.moveUnit(game.id, 99, targetCoords); // wywolanie testowanej metody; result to zwrocona wartosc

    // expect(result) buduje asercje: przekazujemy tu wynik, ktory chcemy zweryfikowac
    // toBe(...) sprawdza, czy referencja/primitive sa DOKŁADNIE tym samym obiektem/liczba/string (===)
    expect(playerServiceMock.findById).toHaveBeenCalledWith(99); // weryfikacja: mock zostal wywolany z id jednostki
    expect(result).toBe(targetCoords); // sprawdzamy, czy metoda zwrocila dokładnie ten obiekt koordynatów, ktory podalismy
  });
});

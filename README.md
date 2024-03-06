# Torpedo

## About

This is an Angular webapp with socket.io backend that implements real time multiplayer. The game is copy of the boardgame Battleships (Torpedó in hungarian)

## Server

Socket.io implementaion that utalizes real time communication between clients and server, uses Rooms and high level websockets that can fall back to http long-polling or be upgraded to websockets automatically

## App

Angular webapp that implements all the gamelogic and front-end.

## Road Map

**SEPTEMBER:**

- [X] Navigation bar
- [X] Registration
- [X] Data models
- [X] Services for data manipulation

**OCTOBER:**

- [X] Matchmaker logic

**NOVEMBER:**

- [ ] Game logic I.

**DECEMBER:**

- [ ] Game logic II.

**JANUARY:**

- [ ] Captians

**FEBUARY:**

- [ ] Leaderboard

**MARCH:**

- [ ] Finalization
- [ ] Start work on thesis

**APRIL:**

- [ ] Thesis

----

*Created by **AQ56DX***

Vázlat:

1. cím: többjátékos realtime angular torpedó ilyesmi
2. feladatleírás, tartalmi összefoglaló
3. bevezetés (cél, indíttatás, ok...)
4. felhasznált technológiák (!!!ne legyen több 3-4 oldalnál!!!, információ közlés a cél)
	- angular, negyed
	- ts, negyed
	- pixi.js, lényeg
	- firebase
	- firestore
	- socket.io, lényeg (dataflow)
	- git flow, negyed
	- chat gpt, dalle, copilot
5. játék terve (hierarchiam, képtervek, progress, tervminta, angular template, use-case, szekvencia (about socket))
6. implementáció (fejlesztéséi folyamat, lépések) ez a leghosszab fejezet -> alfejezetekre bontani
	- felület
	- backend
	- databse
	- game logic
	- lehet kódokat, képernyőképeket is (!!! fél oldalnál nagyobb kép nem számít a hosszba, csak az érdekesebbeket érdemes berakni, metódust fel lehet darabolni -> [...] ami nem olyan fontos !!!)
7. bugok megoldása, tesztelése
	- tesztelés, barátokkal, local, server setup...
	- megtalált hibák javítása (bugos code vs. javított code)
8. összefoglalás
	- mit csináltál, mit valósítottál meg
	- mit kaptam ebből a projektből (személyes)
	- új ismeretek megszerzése (technológia)

Szakirodalmak: Angular könyv, clean code könyv,
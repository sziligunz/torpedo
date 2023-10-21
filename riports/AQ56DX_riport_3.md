# Riport 3

## Októberi mérföldkő

- [X] Matchmaker logika

*Minden feladatot sikerült befejezni az októberi mérföldkőből.*

## Matchmaker logika

A matchmaker logikát befejeztem:

- a szerver 5 másodpercenként próbál sor struktúrában tárolt felhasználókból meccselni
- sikeres meccselés esetén külön szobába kerülnek a felhasználók, törlődnek a sorból és automatikusan átnavigálódnak a *'game'* oldalra
- biztonsági eljárások:
  - szerver oldalon nem lehet többször belépni matchmakingbe (max: 1)
  - kliens oldalon nem lehet többször megnyomni a matchmaking gombot
  - csak akkor lehet a *'game'* oldalra navigálni, ha szobába van helyezve az adott felhasználó
- le lett kezelve ha:
  - a felhasználó kilép a matchmakingből
  - a felhasználó kilép a meccsből (egy generált szobából)

----

*Repository [link](https://github.com/sziligunz/torpedo).*

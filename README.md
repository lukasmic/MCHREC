# MCHREC

This is a tool inspired by edhrec.com to provide deckbuilding advice for Marvel Champions LCG produced by Fantasy Flight Games.
The decklists and card data for this tool come from the API provided by MarvelCDB
https://marvelcdb.com/api/

## Overview:

### Why should I care?

Some players are simply not very good deckbuilders for this game (like myself!)
A couple of my friends meanwhile are good at finding generic "goodstuff" rather than finding specific cards that pair well with the strengths of individual heroes, and their ability to contribute to a multiplayer game (or prevail against harder villains while playing solo) suffer as a result.
Some players even dismiss earnestly good heroes that they otherwise might have enjoyed for this reason.

### How does it work?

The main focus of the website is going to be the "hero guide" page. All you have to do is choose your hero from the drop-down menu, then select your aspect (Adam Warlock doesn't have to choose an aspect; Spider-Women must select two).
Once you hit submit, MCHREC goes through all our deck data and finds every card used in each of those decks, then for each individual card, we calculate its "synergy score" - (the popularity of that card for that hero/aspect) minus (other decks of that aspect).

On the "staples" page, you can also choose an aspect to find the most popularly used cards for that aspect overall
## Gebruiken als extensie

Deze repository kan worden toegevoegd als **extensie** in MakeCode.
Echter is de code niet compleet omdat er een array ontbreekt.
Zonder de array levert dit de foutmelding: **Cannot find name 'songnotes'**. 

## De array 'songnotes' toevoegen

De array 'songnotes' bevat de midi-instructies voor een audioclip en
wordt met het programma **MidiBuilder** gebouwd. Door in **MidiBuilder**
op **SCRIPT** te klikken, verschijnt een venster met de declaratie
van de array 'songnotes'. Kopieer de inhoud en plak deze in het
javascript-venster van je MakeCode-programma. Alle andere code kun
je verwijderen. Klik in Makecode op **Downloaden** en steek de microbit
in de edge-connector van de midi-interface. Nu is je microbit een
eenvoudige midi-controller. Het afspelen start met de 'A'-knop en stopt
met de 'B'-knop.

## De audioclip afspelen

Behalve met de 'A'-knop van de midi-controller-microbit, kan er ook
op afstand worden afgespeeld. De MakeCode-extensie **pxt-mide** biedt
hier de ondersteuning voor. Je kunt er bovendien het volume mee instellen,
het tempo aanpassen, instrumenten kiezen en de audioclip transponeren.
Dit is tijdens het afspelen mogelijk. Door de **pxt-midi**-extensie
met andere extensies te combineren kun je bijvoorbeeld de muziek op beweging
laten reageren of robot-bewegingen met de muziek synchroniseren.

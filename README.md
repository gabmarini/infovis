# Learn D3.js: Snowfalling

Questo progetto mira a costruire una scena rappresentante una nevicata, tre fiocchi di neve vengono creati al di sopra dell'area di disegno ogni secondo e vengono fatti scendere fino alla base, una volta arrivati alla base i fiocchi si accumulano.

### Caratteristiche dei fiocchi

* Ogni fiocco ha una dimensione randomica, compresa tra due limiti
* Ogni fiocco ha una sua opacità, dipendente dalla sua dimensione, più il fiocco è grande più la sua opacità sarà alta, viceversa se il fiocco è più piccolo la sua opacità sarà minore, questo è fatto per provare a realizzare un effetto 3D in cui i fiocchi più distanti dall'osservatore risultano più piccoli e meno opachi, risultando quindi meno definiti.
* Ogni fiocco ha la sua velocità di discesa dipendente dalla sua dimensione, più il fiocco è grande più la sua velocià di discesa sarà alta, viceversa se il fiocco è più piccolo la sua velocità di discesa sarà minore, in questo modo i fiocchi più vicini all'osservatore cadono più velocemente di quelli sullo sfondo.
* Ogni fiocco si muove lateralmente in maniera lineare, lo spostamento laterale è sì randomico ma limitato entro certi limiti: 100px massimo a destra/sinistra rispetto al fiocco, questo per non avere fiocchi che si muovono in maniera troppo repentina. Il fiocco si muove comunque sempre dentro l'area di disegno non uscendo mai da quest'ultima.

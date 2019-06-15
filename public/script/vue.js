var purpose_array = ['what','how','why']
var language_sigla = ['ita','eng','deu','fra','esp']
var language_nome = ['italiano','inglese','tedesco','francese','spagnolo']
var content_sigla = ['none','nat','art','his','flk','mod','rel','cui','spo','mus','mov','fas','shp','tec','pop','prs','oth']
var content_nome =['nessuna','natura','arte','storia','folklore','cultura moderna','religione','cucina e drink','sport','musica','film','moda','shopping','tecnologia','cult. pop. e gossip','esperienze personali','altro']
var audience_sigla = ['gen','pre','elm','mid','scl']
var audience_nome = ['pubblico generico','pre-scuola','scuola primaria','scuola media','specialisti del settore']
var detail_numero = ['1','2','3']
var detail_significato = ['leggero','medio','approfondito']
new Vue({
	el: '#metadati',
	data() {
		return {
			visualizza: true,
			purpose_opzioni: purpose_array,
			purpose_picked: purpose_array[0],
			language_opzioni: language_nome,
			language_selected: language_nome[0],
			content_opzioni: content_nome,
			content_selected: content_nome[0],
			audience_opzioni: audience_nome,
			audience_selected: audience_nome[0],
			detail_opzioni: detail_significato,
			detail_selected: detail_significato[0],
			titolo: '',
			testo: '',
			stringa_metadati: '',
		}
	},
	methods: {
		insert : function(){
			var tit = document.getElementById("titolo").value;
			var text = document.getElementById("testo").value;
			if(tit == '')
			{
				alert("Errore titolo vuoto")
			}
			else if(text == '')
			{
				alert("Errore testo vuoto")
			}
			else
			{
				this.titolo = tit
				this.testo = text
				var geo = "8FPHF8VV+57"; //coordinate di esempio(da tenere fino a quando non otteniamo quelle vere)
				var pur = this.purpose_picked;
				var ilan = language_nome.indexOf(this.language_selected)
				var icon = content_nome.indexOf(this.content_selected)
				var iaud = audience_nome.indexOf(this.audience_selected)
				var idet = detail_significato.indexOf(this.detail_selected)
				this.stringa_metadati = geo + ":" + pur + ":" + language_sigla[ilan] + ":" + content_sigla[icon] + ":A" + audience_sigla[iaud] + ":P" + detail_numero[idet]
			}
		},
		translate : function(){
			if(this.stringa_metadati == '')
			{
				alert("Errore nessuna clip inserita")
			}
			else
			{
				array_dati = this.stringa_metadati.split(":");
				var ipur = purpose_array.indexOf(array_dati[1])
				var ilan = language_sigla.indexOf(array_dati[2])
				var icon = content_sigla.indexOf(array_dati[3])
				var iaud = audience_sigla.indexOf(array_dati[4].split("A").pop())
				var idet = detail_numero.indexOf(array_dati[5].split("P").pop())
				alert("Titolo: " + this.titolo + "\nTesto: " + this.testo + "\nGeoloc: " + array_dati[0] + "\nPurpose: " + purpose_array[ipur] + "\nLanguage: " + language_sigla[ilan]  + " (" + language_nome[ilan] + ")\nContent: " + content_sigla[icon] + " (" + content_nome[icon] + ")\nAudience: " + audience_sigla[iaud] + " (" + audience_nome[ilan] + ")\nDettagli: " + detail_numero[idet] + " (" + detail_significato[idet] + ")")
			}
		}
	}
})

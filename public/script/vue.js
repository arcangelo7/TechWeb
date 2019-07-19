var purpose_array = ['what','how','why']
var language_sigla = ['it','en','de','fr','es']
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
			purpose_selected: purpose_array[0],
			language_opzioni: language_nome,
			language_sigla: language_sigla,
			content_opzioni: content_nome,
			content_sigla: content_sigla,
			audience_opzioni: audience_nome,
			audience_sigla: audience_sigla,
			detail_opzioni: detail_significato,
			detail_numero: detail_numero,
			titolo: '',
			testo: '',
			stringa_metadati: '',
		}
	},
	methods: {
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

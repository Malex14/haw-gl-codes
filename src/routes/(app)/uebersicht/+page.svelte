<a href="/" class="mb-2 inline-block hover:underline">&larr; zurück</a>

<div class="prose">
	<h1>HAW Gitlab Beitrittscodes</h1>
	<p>
		Mit dieser Seite können Beitrittscodes bzw. Kurzlinks (ähnlich zu MS Teams) erzeugt werden, mit
		denen Teilnehmer von Kursen oder Tutorien in Projekte (d.h. Repos) oder Gruppen beitreten
		können.
	</p>

	<h2>Wie lösche ich einen Beitrittscodes?</h2>
	<p>
		Gehe dazu einfach in die Einstellungen des dazugehörigen Projektes (Repos) bzw. der Gruppe und
		lösche den entsprechenden "Access Token". Dieses System erkennt dies und der Code wird gelöscht.
	</p>

	<h2>Funktionsweise</h2>
	<p>
		Zunächst werden die Nutzerinnen und Nutzer über OAuth bzw. OpenID Connect authentifiziert.
		Dannach läuft es im Hintergrund es wie folgt ab: Wenn ein neuer Code erzeugt wird, legt dieses
		System über die Gitlab API einen "Access Token" für das gewählte Projekt bzw. die gewählte
		Gruppe an und speichert diesen und einige weitere Informationen in einer Datenbank ab. Der Token
		ist auch in den jeweiligen Einstellungen bei Gitlab sichtbar. Wenn nun jemand einen
		Beitrittscode eingibt wird wieder die Gitlab API genutzt um die Person hinzuzufügen, dabei wird
		sich mit dem Token authentifiziert.
	</p>

	<h2>Ich habe einen Fehler gefunden</h2>
	<p>
		Wenn du einen Fehler gefunden hast melde diesen bitte in dem unten verlinken GitHub-Repo als
		neues Issue. Vielen Dank!
	</p>
</div>

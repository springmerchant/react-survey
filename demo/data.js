const fakeSurvey = {
  name: "Enquete de satisfaction",
  id: 1,
  random: true,
  timeBeforePopUp: 5, // in seconds
  postUrl: "http://localhost:3000/surveys/1/participations",
  questions: [
    {
      text: "Etes-vous satisfait du site pour l'instant ?",
      choices: [
        {
          text: "oui",
          id: 1,
        },
        {
          text: "non",
          id: 2,
        },
      ],
      multiple: false,
      id: 1,
      required: true,
    },
    {
      text:
        "Pensez vous que nous devrions mettre un 'paint' directement dans le site ?",
      choices: [
        {
          text: "oui",
          id: 3,
        },
        {
          text: "non",
          id: 4,
        },
      ],
      multiple: false,
      id: 2,
      required: true,
    },
    {
      text:
        "Quelle est la ou les prochaines fonctionnalités que vous aimeriez voir ?",
      choices: [
        {
          text: "des commentaires",
          id: 5,
        },
        {
          text: "d'autres media (son, video...)",
          id: 6,
        },
        {
          text:
            "un mode donjon et dragon (jet de dés qui definissent la prochaine image)",
          id: 7,
        },
      ],
      multiple: true,
      id: 3,
      required: false,
    },
  ],
  ending: {
    text:
      "Merci d'avoir repondu ! Vous pouvez nous laisser votre mail si vous acceptez que nous vous contactions pour vous demander votre avis pour des fonctionnalités futures :) Vous pouvez vos idées/suggestions/doléances dans le champ suivant",
    email: true,
    freeSpeech: true,
  },
  messages: {
    errorMessage: "Vous devez selectionner une option",
    welcomeMessage:
      "Bonjour ! Nous esperons que le site vous plait et nous vous serions tres reconnaissants de prendre quelques instants pour repondre a 3 questions :)",
    nextMessage: "Suivant",
    endMessage: "Finir",
    endingMessage: "Merci a vous ! Vos reponses ont été enregistrées !",
    closeMessage: "Fermer",
  },
};

export { fakeSurvey };

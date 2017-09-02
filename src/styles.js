const lightBlue = "#6cdbdc";

const styles = {
  boxStyle: {
    width: "300px",
    minHeight: "300px",
    position: "fixed",
    bottom: "20px",
    right: "20px",
    border: `2px solid ${lightBlue}`,
    borderRadius: "5px",
    padding: "10px",
    backgroundColor: "#fff",
  },
  heading: {
    title: {
      textAlign: "center",
      fontWeight: "bold",
      color: lightBlue,
      fontSize: "1.4em",
      margin: "5px 0",
    },
    description: {
      textAlign: "justify",
      textJustify: "inter-word",
      padding: "0 20px",
    },
  },
  question: {
    text: {
      fontWeight: "bold",
    },
  },
  displayButtonsStyle: {
    marginBottom: "2px",
  },
  foldedStyle: {
    height: "20px",
    overflow: "hidden",
  },
  hiddenStyle: {
    display: "none",
  },
};

export { styles };

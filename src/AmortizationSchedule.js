import React, { useState } from "react";
import {
  Worker,
  Viewer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf-viewer/core";
import { saveAs } from "file-saver";

const AmortizationPDF = () => {
  const data = [
    // Your amortization schedule data here
  ];

  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      backgroundColor: "#E4E4E4",
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Amortization Schedule</Text>
          {/* Render your amortization schedule data here */}
        </View>
      </Page>
    </Document>
  );
};

const App = () => {
  const [pageNumber, setPageNumber] = useState(1);

  const onDownloadPDF = () => {
    const blob = new Blob([<AmortizationPDF />], { type: "application/pdf" });
    saveAs(blob, "amortization_schedule.pdf");
  };

  return (
    <div>
      <Worker
        workerUrl={`https://unpkg.com/pdfjs-dist@${"2.9.359"}/build/pdf.worker.min.js`}
      >
        <Viewer fileUrl="some-url" />
      </Worker>
      <button onClick={onDownloadPDF}>Download PDF</button>
    </div>
  );
};

export default App;

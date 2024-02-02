import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";

function App() {
  //state management

  const [loanAmount, setLoanAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState();
  const [numMonths, setNumMonths] = useState("");
  const [annualInterestRate, setAnnualInterestRate] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [principalAmount, setPrincipalAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState();
  const [selectedYear, setSelectedYear] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState("");
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);
  const [extraPrincipal, setExtraPrincipal] = useState("");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: 10 },
    (_, index) => new Date().getFullYear() + index
  );

  const handleMonthSelect = (month, type) => {
    if (type === "start") {
      setStartMonth(month);
    } else {
      setEndMonth(month);
    }
  };

  const handleYearSelect = (year, type) => {
    if (type === "start") {
      setStartYear(year);
    } else {
      setEndYear(year);
    }
  };
  useEffect(() => {
    // This code will run after totalAmount state is updated
    console.log("Total Loan Payment updated:", totalAmount);

    // Display the total payment amount on the first request
    if (totalAmount > 0) {
      <p>You'll pay a total of $${totalAmount}</p>;
    }
  }, [totalAmount]);

  const handleExtraPrincipalChange = (e) => {
    setExtraPrincipal(e.target.value);
  };

  const handleMonthlyPayment = () => {
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    // console.log("monthly Interests ---------------->", monthlyInterestRate);
    const numberOfPayments = numMonths;
    // console.log("number of Payment ---->", numberOfPayments);
    const numerator =
      monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments);
    // console.log("numerator", numerator);
    const denominator = Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;
    // console.log("denominator", denominator);
    const monthlyPaymentValue = loanAmount * (numerator / denominator);
    // console.log("monthlypayment----->", monthlyPaymentValue);
    setMonthlyPayment(monthlyPaymentValue.toFixed(2));
  };
  const calculateMonthlyPayment = () => {
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const numberOfPayments = numMonths;
    const numerator =
      monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments);
    const denominator = Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;
    return loanAmount * (numerator / denominator);
  };
  // Function to get the current year
  function getCurrentYear() {
    return new Date().getFullYear();
  }
  // generate Amortization Schedule
  const generateAmortizationSchedule = () => {
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const numberOfPayments = numMonths;
    const numerator =
      monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments);
    const denominator = Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;

    const monthlyPaymentValue = loanAmount * (numerator / denominator);

    const monthlyPayment = calculateMonthlyPayment();
    setMonthlyPayment(monthlyPayment.toFixed(2));

    const totalAmount = (monthlyPayment * numberOfPayments).toFixed(2);
    // console.log("total loan payement", totalAmount);
    setTotalAmount(totalAmount);

    const extraPrincipalValue = parseFloat(extraPrincipal) || 0;
    const schedule = [];
    let remainingBalance = loanAmount;
    let count;

    for (let i = 1; i <= numMonths; i++) {
      const interestPaid = remainingBalance * monthlyInterestRate;
      const principalPaid = monthlyPaymentValue - interestPaid;
      remainingBalance -= principalPaid;
      if (remainingBalance <= 0) {
        remainingBalance = 0; // Set remaining balance to zero if it becomes negative
      }
      count = i;
      const year = years[Math.floor((startMonth - 1 + i) / 12) % years.length];
      schedule.push({
        count,
        month: months[(startMonth - 1 + i) % 12],
        year,
        payment: monthlyPayment.toFixed(2),
        principalPaid: principalPaid.toFixed(2),
        interestPaid: interestPaid.toFixed(2),
        remainingBalance: remainingBalance.toFixed(2),
      });
    }

    setAmortizationSchedule(schedule);
  };

  //extra principal schedule
  // generate Amortization Schedule
  const generateExtraAmortizationSchedule = () => {
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const numberOfPayments = numMonths;
    const numerator =
      monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments);
    const denominator = Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;
    const extraPrincipalValue = parseFloat(extraPrincipal) || 0;
    const monthlyPaymentValue =
      loanAmount * (numerator / denominator) + extraPrincipalValue;

    const totalAmount = (monthlyPaymentValue * numberOfPayments).toFixed(2);
    setTotalAmount(totalAmount);

    const schedule = [];
    let remainingBalance = loanAmount; // Include extra principal in the initial balance
    console.log("remainningBalance", remainingBalance);
    let count;

    for (let i = 1; i <= numMonths; i++) {
      const interestPaid = remainingBalance * monthlyInterestRate;
      const principalPaid = monthlyPaymentValue - interestPaid;
      remainingBalance -= principalPaid;
      if (remainingBalance <= 0) {
        remainingBalance = 0; // Set remaining balance to zero if it becomes negative
      }
      count = i;
      const year = years[Math.floor((startMonth - 1 + i) / 12) % years.length];
      schedule.push({
        count,
        month: months[(startMonth - 1 + i) % 12],
        year,
        payment: monthlyPaymentValue.toFixed(2),
        principalPaid: principalPaid.toFixed(2),
        interestPaid: interestPaid.toFixed(2),
        remainingBalance: remainingBalance.toFixed(2),
      });
    }

    setAmortizationSchedule(schedule);
  };
  return (
    <div className="w-100 d-flex flex-column align-items-center justify-content-center ">
      <div className="w-100 align-items-center justify-content-center text-center p-2 bg-warning">
        <h1>
          Monthly Payment Loan Calculator <br />
          <span>w</span>/Extra Payments
        </h1>
        <hr />
        <div className="w-100 d-flex flex-column justify-content-center align-item-center">
          {/* loan field and button */}
          <div className="d-flex mb-3 w-100 align-item-center justify-content-center gap-4">
            <label className="align-self-center">Loan Amount</label>
            <span>$</span>
            <input
              placeholder="Loan Amount"
              className="w-30 align-self-center"
              type={Number}
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
            />
            <button type="button" class="btn btn-primary">
              Principal
            </button>
          </div>
          <hr />
          {/* loan field and button */}
          <div className="d-flex mb-3 w-100 align-item-center justify-content-center gap-4">
            <label className="align-self-start"># of Months</label>
            <input
              placeholder="No. of Month"
              className="w-30 align-self-center"
              type={Number}
              value={numMonths}
              onChange={(e) => setNumMonths(e.target.value)}
            />
            <button type="button" class="btn btn-primary ">
              Months
            </button>
          </div>
          <hr />
          {/*  */}
          <div className="d-flex w-100 align-item-center justify-content-center gap-4 m-2">
            <label className="align-self-center">Annual Interest Rate</label>
            <input
              placeholder="Interest Rate"
              className="w-20 align-self-center justify-content-center align-item-center"
              type={Number}
              value={annualInterestRate}
              onChange={(e) => setAnnualInterestRate(e.target.value)}
            />
            <span>%</span>
            <button type="button" class="btn btn-primary ">
              Rate
            </button>
          </div>
          <hr />
          {/* Monthly Payment */}
          <div className="d-flex w-100 align-item-center justify-content-center gap-4 m-2">
            <label className="align-self-center">Monthly Payment</label>
            <span>$</span>
            <input
              placeholder="Monthly Payment"
              className="w-20"
              type={Number}
              value={monthlyPayment}
            />
            <button
              type="button"
              class="btn btn-primary "
              onClick={handleMonthlyPayment}
            >
              Payment
            </button>
          </div>
          <hr />

          {/* <p>You'll pay a total of ${totalAmount}</p> */}
        </div>
        {/* {totalAmount !== 0 && <p>You'll pay a total of ${totalAmount}</p>} */}
      </div>
      <div className="w-100">
        <div className="w-100 align-items-centertext-center p-4 bg-warning">
          <div className="d-flex w-100 align-item-center justify-content-around">
            <label className="w-50">Extra Principal Payment</label>
            <span>$</span>
            <input
              placeholder="Extra Principal Payments"
              className="w-25"
              type={Number}
              // value={}
              onChange={(e) => setExtraPrincipal(e.target.value)}
            />
            <div className="d-flex w-100 align-item-center justify-content-center">
              {/* <Dropdown>
                <Dropdown.Toggle variant="secondary">
                  {startMonth || "Select Month"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {months.map((month, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => handleMonthSelect(month, "start")}
                    >
                      {month}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown>
                <Dropdown.Toggle variant="secondary">
                  {startYear || "Select Year"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {years.map((year, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => handleYearSelect(year, "start")}
                    >
                      {year}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <label className="align-self-center">to</label>
              <Dropdown>
                <Dropdown.Toggle variant="secondary">
                  {endMonth || "Select Month"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {months.map((month, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => handleMonthSelect(month, "end")}
                    >
                      {month}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown>
                <Dropdown.Toggle variant="secondary">
                  {endYear || "Select Year"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {years.map((year, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => handleYearSelect(year, "end")}
                    >
                      {year}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown> */}

              <button
                type="button"
                class="btn btn-primary "
                onClick={
                  extraPrincipal === 0
                    ? generateAmortizationSchedule
                    : generateExtraAmortizationSchedule
                }
              >
                View Amortization Schedule
              </button>
            </div>
            <div className="w-100 d-flex align-items-center justify-content-center">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  setLoanAmount("");
                  setNumMonths("");
                  setAnnualInterestRate("");
                  setMonthlyPayment("");
                  setPrincipalAmount("");
                  setInterestRate("");
                  setSelectedMonth();
                  setSelectedYear("");
                  setStartMonth("");
                  setStartYear("");
                  setEndMonth("");
                  setEndYear("");
                  setAmortizationSchedule([]);
                  setExtraPrincipal("");
                  setTotalAmount(0.0);
                  setExtraPrincipal(0);
                }}
              >
                Clear All Fields
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-100 gap-4 align-items-center justify-content-center text-light p-2 bg-success">
        <h3 className="text-center"> Amortization Schedule</h3>
        <p className="text-center">
          <b>
            ${loanAmount} Loan {annualInterestRate} % Interest Rate
          </b>
        </p>
        <p className="text-center">
          You'll pay a total of <strong>${totalAmount}</strong>
        </p>
        {amortizationSchedule.length > 0 && (
          <table class="table p-2">
            <thead>
              <tr>
                <th scope="col">Sr.No#</th>
                <th scope="col">Month</th>
                <th scope="col">Year</th>
                <th scope="col">Payment</th>
                <th scope="col">Principal Paid</th>
                <th scope="col">Interest Paid</th>
                <th scope="col">Remaining Balance</th>
              </tr>
            </thead>
            <tbody>
              {amortizationSchedule.map((entry) => (
                <tr key={entry.month} scope="row">
                  <td>{entry.count}</td>
                  <td>{entry.month}</td>
                  <td>{entry.year}</td>
                  <td>${entry.payment}</td>
                  <td>${entry.principalPaid}</td>
                  <td>${entry.interestPaid}</td>
                  <td>${entry.remainingBalance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {amortizationSchedule.length > 0 && (
          <div className="text-center">
            <p>
              <b>Total Principal Paid: $</b>
              {amortizationSchedule
                .reduce(
                  (total, entry) => total + parseFloat(entry.principalPaid),
                  0
                )
                .toFixed(2)}
            </p>
            <p>
              <b>Total Interest Paid: $</b>
              {amortizationSchedule
                .reduce(
                  (total, entry) => total + parseFloat(entry.interestPaid),
                  0
                )
                .toFixed(2)}
            </p>
            <p>
              <b>Total Payment Paid: $</b>
              {amortizationSchedule
                .reduce((total, entry) => total + parseFloat(entry.payment), 0)
                .toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

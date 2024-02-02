import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";

function App() {
  //state management

  const [loanAmount, setLoanAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
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

  const handleMonthlyPayment = () => {
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    console.log("monthly Interests ---------------->", monthlyInterestRate);
    const numberOfPayments = numMonths;
    console.log("number of Payment ---->", numberOfPayments);
    const numerator =
      monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments);
    console.log("numerator", numerator);
    const denominator = Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;
    console.log("denominator", denominator);
    const monthlyPaymentValue = loanAmount * (numerator / denominator);
    console.log("monthlypayment----->", monthlyPaymentValue);
    setMonthlyPayment(monthlyPaymentValue.toFixed(2));

    //total loan amount
    const totalAmount = monthlyPayment * numberOfPayments;
    console.log("total loan payement", totalAmount);
    setTotalAmount(totalAmount.toFixed(2));
    // console.log("set total loan payement", setTotalAmount);
  };
  const calculateMonthlyPayment = () => {
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const numberOfPayments = numMonths;
    const numerator =
      monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments);
    const denominator = Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;
    return loanAmount * (numerator / denominator);
  };

  // const calculateTotalLoan = ({ monthlyPayment, numberOfPayments }) => {
  //   return monthlyPayment * numberOfPayments;
  // };

  useEffect(() => {
    // This code will run after totalAmount state is updated
    console.log("Total Loan Payment updated:", totalAmount);
  }, [totalAmount]);
  function getCurrentMonth() {
    return new Date().getMonth() + 1; // Adding 1 because months are zero-indexed
  }

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

    const schedule = [];
    let remainingBalance = loanAmount;
    let count;

    for (let i = 1; i <= numMonths; i++) {
      const interestPaid = remainingBalance * monthlyInterestRate;
      const principalPaid = monthlyPaymentValue - interestPaid;
      remainingBalance -= principalPaid;
      count = i;
      schedule.push({
        count,
        month: months[(startMonth - 1 + i) % 12],

        payment: monthlyPayment.toFixed(2),
        principalPaid: principalPaid.toFixed(2),
        interestPaid: interestPaid.toFixed(2),
        remainingBalance: remainingBalance.toFixed(2),
      });
    }

    setAmortizationSchedule(schedule);
  };
  return (
    <div className="w-100 d-flex flex-column align-items-center justify-content-center ">
      <div className="container w-75 align-items-center justify-content-center text-center p-2 bg-light">
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
          {loanAmount !== null && <p>You'll pay a total of ${totalAmount}</p>}
          {/* <p>You'll pay a total of ${setTotalAmount}</p> */}
        </div>
      </div>
      <br />
      <div className="w-40 bg-success">
        <div className="container w-53 align-items-center justify-content-center text-center p-2 bg-light">
          <div className="d-flex w-100 align-item-center justify-content-center gap-4 m-2">
            <label className="">Extra Principal Payment</label>
            <span>$</span>
            <input
              placeholder="Extra Principal Payments"
              className="w-20"
              type={Number}
              // value={}
            />
            <div className="d-flex w-100 align-item-center justify-content-center gap-4 m-2">
              <Dropdown>
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
              </Dropdown>

              <button
                type="button"
                class="btn btn-primary "
                onClick={generateAmortizationSchedule}
              >
                View Amortization Schedule
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-50 gap-20 align-items-center justify-content-center text-light  bg-success border">
        <h3 className="text-center"> Amortization Schedule</h3>
        <p className="text-center">
          <b>
            ${loanAmount} Loan {annualInterestRate} % Interest Rate
          </b>
        </p>
        {amortizationSchedule.length > 0 && (
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Sr.No#</th>
                <th scope="col">Month</th>

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
                  <td>${entry.payment}</td>
                  <td>${entry.principalPaid}</td>
                  <td>${entry.interestPaid}</td>
                  <td>${entry.remainingBalance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;

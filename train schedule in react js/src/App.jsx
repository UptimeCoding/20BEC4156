/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

async function getAuthToken() {
  try {
    const authOptions = {
      method: "POST",
      url: "http://20.244.56.144/train/auth",
      headers: { "content-type": "application/json" },
      data: {
        companyName: "Train Central",
        clientID: "4213e779-dd23-45b9-b630-3c0e5c678bf8",
        clientSecret: "mvYmaFEjLgSvndTe",
        ownerName: "Varnika",
        ownerEmail: "varnikkas02@gmail.com",
        rollNo: "20BEC4208",
      },
    };
    const { data: authData } = await axios.request(authOptions);
    return authData.access_token;
  } catch (error) {
    return null;
  }
}
export default function App() {
  return (
    <>
      <div className="min-h-full">
        <div className="py-10">
          <header>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">
                Train Schedule
              </h1>
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<Table />} />
              </Routes>
              <Routes>
                <Route path="/train/:trainNumber" element={<TrainDetails />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

function Table() {
  const [trains, setTrains] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const authToken = await getAuthToken();
        const options = {
          method: "GET",
          url: "http://20.244.56.144/train/trains",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        };
        const { data } = await axios.request(options);
        setTrains(data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 mt-8">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Train Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Train Number
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Departure Time
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Seats Available
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Delayed By
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trains?.map((train, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <Link to={`/train/${train.trainNumber}`}>
                          {train.trainName}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {train.trainNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {train.departureTime.Hours} :{" "}
                        {train.departureTime.Minutes} :{" "}
                        {train.departureTime.Seconds}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {train.seatsAvailable.sleeper + train.seatsAvailable.AC}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {train.delayedBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
// {"trainName":"Bokaro Exp","trainNumber":"2347","departureTime":{"Hours":13,"Minutes":32,"Seconds":0},"seatsAvailable":{"sleeper":55,"AC":0},"price":{"sleeper":148,"AC":338},"delayedBy":7}

function TrainDetails() {
  const [train, setTrain] = useState(null);
  const { trainNumber } = useParams();
  useEffect(() => {
    (async () => {
      try {
        const authToken = await getAuthToken();
        const options = {
          method: "GET",
          url: `http://20.244.56.144/train/trains/${trainNumber}`,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        };
        const { data } = await axios.request(options);
        setTrain(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Train Schedule Information
        </h3>
        <Link
          to="/"
          className="p-2 bg-indigo-600 text-white items-center rounded-md"
        >
          Go Back
        </Link>
      </div>

      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Train Name</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {train?.trainName}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Train Number</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {train?.trainNumber}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Departure Time
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {train?.departureTime.Hours} : {train?.departureTime.Minutes} :{" "}
              {train?.departureTime.Seconds}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Seats Available
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              Sleeper: {train?.seatsAvailable.sleeper} AC:{" "}
              {train?.seatsAvailable.AC}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Price</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              Sleeper: {train?.price.sleeper} AC: {train?.price.AC}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Delayed By</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {train?.delayedBy}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

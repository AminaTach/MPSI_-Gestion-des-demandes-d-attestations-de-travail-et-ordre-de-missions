import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Topbar';
import StatsCard from '../components/Dashboard/StatsCard';
import Table from '../components/Dashboard/Table';
import RenderedPieChart from '../components/Dashboard/RenderedPiehart';
import { FaRegCalendarAlt, FaRegFileAlt, FaRegUser } from 'react-icons/fa';
import MonthlyDemandsChart from '../components/Dashboard/MonthlyDemandsChart';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [attestationData, setAttestationData] = useState([]);
    const [ordresDeMissionData, setOrdresDeMissionData] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);
    const [monthlyDemandsData, setMonthlyDemandsData] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/stats/');
                setStats(response.data);

                // Fetch attestation data
                const attestationResponse = await axios.get('http://localhost:8000/api/demande-attestation/all/');
                setAttestationData(attestationResponse.data.demandes);

                // Fetch ordre de mission data
                const ordreMissionResponse = await axios.get('http://localhost:8000/api/demande-ordre-mission/all/');
                setOrdresDeMissionData(ordreMissionResponse.data.demandes);

                // Prepare pie chart data
                const pieData = [
                    { name: 'En attente', value: response.data.attestation_status.en_attente },
                    { name: 'Validée', value: response.data.attestation_status.validee },
                    { name: 'Rejetée', value: response.data.attestation_status.rejetee },
                ];
                setPieChartData(pieData);

                // Prepare monthly demands data
                setMonthlyDemandsData(response.data.monthly_stats.ordre);

            } catch (error) {
                console.error('Erreur lors de la récupération des statistiques:', error);
            }
        };

        fetchStats();
    }, []);

    if (!stats) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="w-full pb-4 font-nunito sm:w-[3/4]">
            <Header />
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 py-8 mt-4 px-4 md:px-8">
                <StatsCard
                    title="Attestation de travail en attente"
                    value={stats.attestation_status.en_attente}
                    icon={<FaRegFileAlt />}
                    percentage={stats.attestation_status.en_attente / stats.total_processed_requests * 100}
                />
                <StatsCard
                    title="Ordres de missions en attente"
                    value={stats.ordre_status.en_attente}
                    icon={<FaRegCalendarAlt />}
                    percentage={stats.ordre_status.en_attente / stats.total_processed_requests * 100}
                />
                <StatsCard
                    title="Total de demandes traitées"
                    value={stats.total_processed_requests}
                    icon={<FaRegUser />}
                    percentage={stats.total_processed_requests / (stats.total_processed_requests + stats.current_month_stats.attestation + stats.current_month_stats.ordre) * 100}
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-4 mt-2 px-4 md:px-8">
                <Table title="Attestation de travail" data={attestationData} />
                <div className="bg-white shadow-md rounded-lg p-4">
                    <div className="text-xl font-bold mb-4">Total des demandes selon leur état</div>
                    <div className="flex justify-center">
                        <RenderedPieChart data={pieChartData} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-4 mt-4 px-4 md:px-8">
                <Table title="Ordres de missions" data={ordresDeMissionData} />
                <div className="bg-white shadow-md rounded-lg p-4">
                    <div className="flex justify-start">
                        <MonthlyDemandsChart data={monthlyDemandsData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

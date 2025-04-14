// src/components/Dashboard.js
import React from 'react';
import Header from '../components/Topbar';
import StatsCard from '../components/Dashboard/StatsCard';
import Table from '../components/Dashboard/Table';
import RenderedPieChart from '../components/Dashboard/RenderedPiehart';
import { FaRegCalendarAlt, FaRegFileAlt, FaRegUser } from 'react-icons/fa';

const Dashboard = () => {
    const attestationData = [
        { sn: 1, demandeur: 'Laurier Boutheyna', date: '15/03/2025', message: 'J’ai pressé.', etat: 'En attente' },
        { sn: 2, demandeur: 'Laurier Boutheyna', date: '01/01/2025', message: 'pour un prêt.', etat: 'Validée' },
        { sn: 3, demandeur: 'Laurier Boutheyna', date: '01/01/2025', message: 'pour un prêt.', etat: 'Rejetée' },
        { sn: 4, demandeur: 'Laurier Boutheyna', date: '01/01/2025', message: 'pour un prêt.', etat: 'Validée' },
    ];

    const ordresDeMissionData = [
        { sn: 1, demandeur: 'Laurier Boutheyna', date: '15/03/2025', message: 'J’ai pressé.', etat: 'En attente' },
    ];

    const pieChartData = [
        { name: 'En attente', value: 37 },
        { name: 'Validée', value: 80 },
        { name: 'Rejetée', value: 17 },
    ];

    return (
        <div className=" w-[3/4] ">
            <Header />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 px-4 md:px-8">
                <StatsCard
                    title="Attestation de travail en attente"
                    value="46"
                    icon={<FaRegFileAlt />}
                    percentage={12}
                />
                <StatsCard
                    title="Ordres de missions en attente"
                    value="16"
                    icon={<FaRegCalendarAlt />}
                    percentage={0.2}
                />
                <StatsCard
                    title="Total de demandes traitées"
                    value="82"
                    icon={<FaRegUser />}
                    percentage={2}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 px-4 md:px-8">
                <Table title="Attestation de travail" data={attestationData} />
                <div className="bg-white shadow-md rounded-lg p-4">
                    <div className="text-xl font-bold mb-4">Total des demandes selon leur état</div>
                    <div className="flex justify-center">
                        <RenderedPieChart data={pieChartData} />
                    </div>
                </div>
            </div>
            <div className="mt-4 px-4 md:px-8">
                <Table title="Ordres de missions" data={ordresDeMissionData} />
            </div>
        </div>
    );
};

export default Dashboard;

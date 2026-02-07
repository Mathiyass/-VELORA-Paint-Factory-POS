
import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { useFinance } from '../../hooks/useFinance';
import FinanceHeader from '../../components/finance/FinanceHeader';
import EmployeeList from '../../components/finance/EmployeeList';
import EmployeeModal from '../../components/finance/EmployeeModal';

export default function Employees() {
    const { employees, actions } = useFinance();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        actions.fetchEmployees();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="h-full bg-[var(--color-bg-app)] text-[var(--color-text-primary)] p-8 overflow-y-auto custom-scrollbar">
            <FinanceHeader
                title="HR & Employees"
                subtitle="Manage staff details and payroll configuration"
                icon={Users}
                onAction={() => setIsModalOpen(true)}
                actionLabel="Add Employee"
            />

            <EmployeeList
                employees={employees}
                onDelete={actions.deleteEmployee}
            />

            <EmployeeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={actions.addEmployee}
            />
        </div>
    );
}

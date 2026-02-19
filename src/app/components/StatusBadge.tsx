interface StatusBadgeProps {
  status: 'Offen' | 'Abgebrochen' | 'In Bearbeitung' | 'Versandt' | 'Geliefert';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'Offen':
        return 'bg-cyan-100 text-cyan-800';
      case 'Abgebrochen':
        return 'bg-red-100 text-red-800';
      case 'In Bearbeitung':
        return 'bg-amber-100 text-amber-800';
      case 'Versandt':
        return 'bg-blue-100 text-blue-800';
      case 'Geliefert':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-4 py-1.5 rounded-full text-sm font-medium inline-block ${getStatusStyles()}`}>
      {status}
    </span>
  );
}

export function transferBadges(transfer) {
    const badges = [
        transfer.direction === 'in' ? 'Transfer Masuk' : 'Transfer Keluar',
    ];

    if (transfer.is_loan) {
        badges.push('On Loan');
    } else if (transfer.fee === null) {
        badges.push('Free Transfer');
    }

    return badges;
}

export function transferValue(transfer) {
    if (transfer.fee !== null) {
        return `€${transfer.fee.toFixed(1)}M`;
    }

    return transfer.is_loan ? 'On Loan' : 'Free';
}

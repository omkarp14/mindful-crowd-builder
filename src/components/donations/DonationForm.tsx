import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useStore';
import { createDonation } from '../../store/slices/donationSlice';
import { HoneyMatch } from '../ui/HoneyMatch';
import { BuzzAlert } from '../ui/BuzzAlert';

interface DonationFormProps {
  campaignId: number;
  campaignTitle: string;
  honeyMatch?: {
    matchAmount: number;
    matchDeadline: string;
    currentAmount: number;
  };
}

export const DonationForm: React.FC<DonationFormProps> = ({
  campaignId,
  campaignTitle,
  honeyMatch,
}) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.donations);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const [formData, setFormData] = useState({
    amount: '',
    anonymous: false,
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value =
      e.target.type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : e.target.value;

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(
        createDonation({
          campaignId,
          amount: parseFloat(formData.amount),
          anonymous: formData.anonymous,
          message: formData.message,
        })
      ).unwrap();

      // Show success alert
      setShowSuccessAlert(true);

      // Reset form
      setFormData({
        amount: '',
        anonymous: false,
        message: '',
      });

      // Hide success alert after 5 seconds
      setTimeout(() => setShowSuccessAlert(false), 5000);
    } catch (error) {
      console.error('Donation failed:', error);
    }
  };

  const suggestedAmounts = [10, 25, 50, 100, 250, 500];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-secondary font-bold text-deepNavy mb-6">
        Support this Campaign
      </h3>

      {honeyMatch && (
        <div className="mb-6">
          <HoneyMatch
            matchAmount={honeyMatch.matchAmount}
            matchDeadline={new Date(honeyMatch.matchDeadline)}
            currentAmount={honeyMatch.currentAmount}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Suggested Amounts */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Suggested Amounts
          </label>
          <div className="grid grid-cols-3 gap-2">
            {suggestedAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setFormData({ ...formData, amount: amount.toString() })}
                className={`py-2 px-4 rounded-md border transition-colors duration-300 ${
                  formData.amount === amount.toString()
                    ? 'bg-honeyGold text-white border-honeyGold'
                    : 'bg-white text-charcoal border-gray-300 hover:bg-softCream'
                }`}
              >
                ${amount}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-charcoal mb-2">
            Custom Amount ($)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min="1"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-honeyGold focus:border-transparent"
            required
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-charcoal mb-2">
            Leave a Message (Optional)
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-honeyGold focus:border-transparent"
          />
        </div>

        {/* Anonymous Donation */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="anonymous"
            name="anonymous"
            checked={formData.anonymous}
            onChange={handleChange}
            className="h-4 w-4 text-honeyGold focus:ring-honeyGold border-gray-300 rounded"
          />
          <label htmlFor="anonymous" className="ml-2 text-sm text-charcoal">
            Make this donation anonymous
          </label>
        </div>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-honeyGold hover:bg-honeyDark text-white font-bold py-3 px-4 rounded-md transition duration-300 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Processing...' : 'Donate Now'}
        </button>
      </form>

      {/* Success Alert */}
      <BuzzAlert
        type="donation"
        message={`Thank you for your donation to ${campaignTitle}!`}
        amount={formData.amount ? parseFloat(formData.amount) : undefined}
        isVisible={showSuccessAlert}
        onClose={() => setShowSuccessAlert(false)}
      />
    </div>
  );
}; 
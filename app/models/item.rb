class Item < ActiveRecord::Base
	validates :title, :card, presence: true

  belongs_to :card
end

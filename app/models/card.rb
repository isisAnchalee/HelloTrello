# == Schema Information
#
# Table name: cards
#
#  id          :integer          not null, primary key
#  title       :string(255)      not null
#  list_id     :integer          not null
#  description :text
#  ord         :float            default(0.0)
#  created_at  :datetime
#  updated_at  :datetime
#

class Card < ActiveRecord::Base
  belongs_to :list
  has_many :items, dependent: :destroy
  has_many :card_assignments, dependent: :destroy

  default_scope { order(:ord) }


   def self.random_card
    adj = Faker::Hacker.adjective
    verb = Faker::Hacker.verb
    ingverb = Faker::Hacker.ingverb
    noun = Faker::Hacker.noun

    desc = 
      "I need to #{verb} your #{adj} #{ingverb} #{noun} today!!"
    list_id = rand(14..16)

    Card.new title: noun, list_id: list_id, description: desc
  end

end

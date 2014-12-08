class RemoveNullConstraint < ActiveRecord::Migration
  def change
  	change_column :cards, :title, :string, null: true
  end
end

"""with sqlmodel

Revision ID: 3ad1dc9d5688
Revises: 596d6dd5078a
Create Date: 2022-11-16 19:46:17.791596

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision = '3ad1dc9d5688'
down_revision = '596d6dd5078a'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('a1_a3_data',
    sa.Column('material_class', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('sheet_title', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('table_heading', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('table_subheading', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('product_code', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('material', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('qty_basis', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('a1_a3_CO2', sa.Float(), nullable=False),
    sa.Column('a1_a3_energy_total', sa.Float(), nullable=False),
    sa.Column('a1_a3_energy_non_renewable', sa.Float(), nullable=False),
    sa.Column('a1_a3_energy_renewable', sa.Float(), nullable=False),
    sa.Column('notes', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('data_quality', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('density', sa.Float(), nullable=False),
    sa.Column('area_density', sa.Float(), nullable=False),
    sa.Column('linear_density', sa.Float(), nullable=False),
    sa.Column('mass_per_unit', sa.Float(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('a1_a3_data')
    # ### end Alembic commands ###

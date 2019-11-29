"""add_doc_name

Revision ID: f50e07565172
Revises: a9f7ec5d1a55
Create Date: 2019-11-28 22:25:49.370735

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f50e07565172'
down_revision = 'a9f7ec5d1a55'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('document', sa.Column('document_name', sa.String(length=40), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('document', 'document_name')
    # ### end Alembic commands ###
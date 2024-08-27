import { Card, createStyles, Image } from '@mantine/core';
import { useRouter } from 'next/router';
import { HDImage } from './HDImage';
import { useGenerationnnnnStore } from '~/store/generationnnnn.store';
import ReactionPicker from '~/omnimuse-lib/features/common/ReactionPicker/ReactionPicker';
import { abbreviateNumber } from '~/utils/number-helpers';
export function ImageCard({
  info = {
    image: 'QmZYwhFyo6FKoxK36HDizssJVy22bjZKRjrBctap7jtTGa',
    reactions: {
      like: {
        count: 0,
        status: false,
      },
      dislike: {
        count: 0,
        status: false,
      },
      heart: {
        count: 0,
        status: false,
      },
      laugh: {
        count: 0,
        status: false,
      },
      cry: {
        count: 0,
        status: false,
      },
    },
    routerPath: '',
  },
}: any) {
  const { open, setImageId } = useGenerationnnnnStore();
  const { classes, cx } = useStyles();
  const router = useRouter();
  const handleDraw = (e: any, id: any) => {
    e.stopPropagation();
    e.preventDefault();
    open();
    setImageId(id);
  };
  return (
    <Card
      className={cx(classes.card)}
      onClick={() => router.push(info.routerPath || '/images/' + info.id)}
    >
      <HDImage src={info.image} />

      <img
        src="/images/models/huabi.svg"
        className="huabi"
        style={{ marginRight: '2px' }}
        onClick={(e) => handleDraw(e, info.id)}
      />

      <div className="info-wrap">
        <div className="flex justify-start items-center absolute bottom-[14px] left-[14px] z-20">
          <div className="mr-[10px]">
            {info.reactions && (
              <ReactionPicker contentId={info.id} expressionType={2} reactions={info.reactions} />
            )}
          </div>
          <div className="inline-flex justify-start items-center rounded-[16px] bg-[var(--color-secondary-bg)] px-[8px]">
            <div>
              <Image src="/images/icon/gold.svg" width={14} height={14} alt="" />
            </div>
            <div className="text-[12px] text-[#FFF] ml-[4px]">
              {abbreviateNumber(info.reward || info.rewardCount)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

const useStyles = createStyles((theme) => ({
  card: {
    borderRadius: '6px',
    height: '412px',
    width: '320px',
    overflow: 'hidden',
    position: 'relative',
    cursor: 'pointer',
    padding: '0 !important',
    flexShrink: 0,
    '.huabi': {
      position: 'absolute',
      top: '12px',
      right: '12px',
    },
    '.image': {
      minWidth: '320px',
      height: '100%',
      flexShrink: 0,
    },
    '.type-wrap': {
      position: 'absolute',
      top: '10px',
      left: '10px',
      display: 'flex',
      borderRadius: '12px',
      padding: '4px 12px',
      background: 'rgba(0, 0, 0, 0.40)',
      color: '#fff',
      fontSize: '12px',
      boxSizing: 'border-box',
      alignItems: 'center',
    },
    '.info-wrap': {
      width: '100%',
      position: 'absolute',
      bottom: 0,
      left: 0,
      display: 'flex',
      boxSizing: 'border-box',
      padding: '14px 14px',
      userSelect: 'none',
      zIndex: 999,
      background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.70) 77.27%)',
    },
  },
}));
